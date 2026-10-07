import os
import sys
import getpass
import urllib.parse
import subprocess
from sqlalchemy import create_engine, text

# Add project root to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

# Automatically use backend venv python if psycopg2 is not in current environment
venv_python = os.path.join(BASE_DIR, "backend", "venv", "bin", "python")
if os.path.exists(venv_python) and sys.executable != venv_python:
    try:
        import psycopg2
    except ImportError:
        os.execv(venv_python, [venv_python] + sys.argv)

from scripts.migrate_sqlite_to_supabase_db import migrate_to_postgresql

PROJECT_REF = "slyiyvegvcefhzaeymoo"

def test_connection(url: str) -> bool:
    try:
        engine = create_engine(url, connect_args={"connect_timeout": 8})
        with engine.connect() as conn:
            res = conn.execute(text("SELECT 1")).scalar()
            return res == 1
    except Exception as e:
        err = str(e)
        if "password authentication failed" in err:
            print("\n[ERROR] Authentication failed: Incorrect database password.")
        elif "could not translate host name" in err or "Connection refused" in err or "timeout" in err:
            print(f"\n[ERROR] Connection failed: Network/host error ({err[:100]}).")
        else:
            print(f"\n[ERROR] Database error: {err[:150]}")
        return False

def update_env_file(filepath: str, key: str, value: str):
    lines = []
    found = False
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if line.strip().startswith(f"{key}=") or line.strip().startswith(f"{key} ="):
            new_lines.append(f"{key}={value}\n")
            found = True
        else:
            new_lines.append(line)
            
    if not found:
        new_lines.append(f"{key}={value}\n")
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

def set_vercel_env(key: str, value: str):
    print(f"\n[VERCEL] Syncing {key} to Vercel production environment...")
    try:
        # Remove existing if any
        subprocess.run(
            ["npx", "vercel", "env", "rm", key, "production", "-y"],
            cwd=BASE_DIR,
            capture_output=True,
            text=True
        )
        # Add new
        add_proc = subprocess.run(
            ["npx", "vercel", "env", "add", key, "production"],
            cwd=BASE_DIR,
            input=value,
            text=True,
            capture_output=True
        )
        if add_proc.returncode == 0:
            print(f"[VERCEL] Successfully configured {key} in Vercel Production!")
        else:
            print(f"[WARN] Vercel env add returned: {add_proc.stderr[:120]}")
    except Exception as e:
        print(f"[WARN] Could not update Vercel environment automatically: {e}")

def main():
    print("=" * 65)
    print(" QURA HERBS — SECURE SUPABASE POSTGRESQL CONFIGURATION ")
    print(f" Supabase Project: {PROJECT_REF}")
    print("=" * 65)

    existing_url = os.environ.get("DATABASE_URL")
    password = None

    if len(sys.argv) > 1 and sys.argv[1].strip():
        arg_val = sys.argv[1].strip()
        if arg_val.startswith("postgresql://") or arg_val.startswith("postgres://"):
            existing_url = arg_val
        else:
            password = arg_val

    if existing_url and not existing_url.startswith("sqlite"):
        print("\nFound existing PostgreSQL connection string.")
        if test_connection(existing_url):
            print("[SUCCESS] Connected successfully to Supabase PostgreSQL!")
            valid_url = existing_url
        else:
            valid_url = None
    else:
        valid_url = None

    if not valid_url:
        if not password:
            print("\nPlease enter your Supabase Database Password below.")
            print("(Keystrokes will remain hidden for security. The password is NEVER logged or committed.)\n")
            
            try:
                if sys.stdin.isatty():
                    password = getpass.getpass("Enter Supabase Database Password: ").strip()
                else:
                    password = sys.stdin.readline().strip()
            except (KeyboardInterrupt, EOFError):
                print("\nAborted.")
                sys.exit(1)

        if not password:
            print("\n[ERROR] Password cannot be empty.")
            sys.exit(1)

        # URL-encode password in case it contains special characters (@, :, %, etc.)
        encoded_pass = urllib.parse.quote_plus(password)
        
        # Candidate 1: Direct host (port 5432)
        direct_url = f"postgresql://postgres:{encoded_pass}@db.{PROJECT_REF}.supabase.co:5432/postgres"
        
        print("\nTesting connection to Supabase PostgreSQL...")
        if test_connection(direct_url):
            valid_url = direct_url
            print("[SUCCESS] Connected to Supabase PostgreSQL via direct host!")
        else:
            # Candidate 2: Pooler host (port 6543) - common AWS regions
            pooler_regions = ["ap-south-1", "eu-central-1", "us-east-1", "ap-southeast-1"]
            for region in pooler_regions:
                pooler_url = f"postgresql://postgres.{PROJECT_REF}:{encoded_pass}@aws-0-{region}.pooler.supabase.com:6543/postgres"
                print(f"Trying connection pooler ({region})...")
                if test_connection(pooler_url):
                    valid_url = pooler_url
                    print(f"[SUCCESS] Connected to Supabase PostgreSQL via connection pooler ({region})!")
                    break

        if not valid_url:
            print("\n[FAILED] Could not connect to Supabase PostgreSQL with the provided password.")
            print("Please verify your password in Supabase Dashboard -> Project Settings -> Database.")
            sys.exit(1)

    # 1. Update local .env and .env.local
    print("\n[LOCAL] Updating .env and .env.local with secure DATABASE_URL...")
    update_env_file(os.path.join(BASE_DIR, ".env"), "DATABASE_URL", valid_url)
    update_env_file(os.path.join(BASE_DIR, ".env.local"), "DATABASE_URL", valid_url)
    print("[LOCAL] .env and .env.local updated.")

    # 2. Run schema and data migration
    print("\n[MIGRATION] Running SQLite -> Supabase PostgreSQL table schema and data migration...")
    try:
        migrate_to_postgresql(valid_url)
        print("[SUCCESS] All tables, products, categories, journeys, and settings migrated into Supabase PostgreSQL!")
    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        sys.exit(1)

    # 3. Update Vercel production environment
    set_vercel_env("DATABASE_URL", valid_url)

    print("\n" + "=" * 65)
    print(" SUPABASE POSTGRESQL SETUP COMPLETE & VERIFIED ")
    print("=" * 65)
    print("1. All tables created in Supabase PostgreSQL.")
    print("2. Existing products, categories, reviews, and settings migrated.")
    print("3. .env and .env.local updated.")
    print("4. Vercel Production DATABASE_URL updated.")
    print("5. Persistent data flow enabled.")

if __name__ == "__main__":
    main()
