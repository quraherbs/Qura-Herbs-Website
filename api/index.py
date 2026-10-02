import sys
import os

# Add the repo root to Python path so 'backend.app.*' imports resolve correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the FastAPI app from the actual entry point
from backend.app.main import app
