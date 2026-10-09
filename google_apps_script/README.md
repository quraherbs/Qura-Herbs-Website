# Qura Herbs — Google Sheets Automatic Order Synchronization Setup

This guide provides instructions to connect the existing Qura Herbs e-commerce platform with the official Google Sheet for automatic order synchronization.

---

## 1. Google Spreadsheet Details
- **Spreadsheet URL**: [https://docs.google.com/spreadsheets/d/1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk/edit?gid=0#gid=0)
- **Spreadsheet ID**: `1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk`
- **Target Worksheet**: `Orders`

---

## 2. Deploying the Google Apps Script Webhook

Follow these steps to deploy the web app endpoint:

1. Open the [Google Sheet](https://docs.google.com/spreadsheets/d/1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk/edit?gid=0#gid=0).
2. Click **Extensions** → **Apps Script** in the top menu.
3. In the script editor:
   - Delete any default code in `Code.gs`.
   - Copy and paste the entire contents of [`google_apps_script/Code.gs`](file:///Users/nandavelv/Documents/Qura%20Herbs/WEBSITE/google_apps_script/Code.gs).
4. Click the **Save** icon (disk icon or `Cmd + S` / `Ctrl + S`).
5. Click **Deploy** → **New deployment**:
   - Click the gear icon next to "Select type" and select **Web app**.
   - **Description**: `Qura Herbs Orders Sync Webhook`
   - **Execute as**: **Me (your Google email)**
   - **Who has access**: **Anyone** *(Required so the backend server can send order updates)*
6. Click **Deploy**.
7. Grant the necessary Google Spreadsheet permissions when prompted.
8. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 3. Configuring Vercel Production Environment Variables

Add the following environment variables to your Vercel project settings (**Project Settings** → **Environment Variables**):

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | `https://script.google.com/macros/s/.../exec` | Deployed Apps Script Web App URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | `qura_sheets_sync_secret_2026` | Secure shared secret token |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | `1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk` | Target Google Sheet ID |

---

## 4. Features & Safeguards

- **Automatic Headers**: Generates the 25 required column headers styled with Qura Herbs brand colors (`#2C1A14`) if the sheet is empty.
- **Deduplication & Idempotency**: If an order with the same `Order ID` is received multiple times (e.g. webhook retries), existing records are updated rather than creating duplicate rows.
- **Multi-Product Orders**: Each purchased item creates a row under the same `Order ID` preserving product name, SKU, price, and item quantity.
- **Status Synchronization**: Payment and fulfillment updates (Confirmed, Shipped, Delivered, Cancelled) dynamically update existing spreadsheet records.
- **Database Safety**: Order transactions in Supabase PostgreSQL are strictly independent—Google Sheets failures never disrupt customer checkouts.
- **Failed Sync Recovery**: Orders marked as `FAILED` sync can be re-synchronized via the admin endpoint `/api/v1/orders/sync-sheets`.
