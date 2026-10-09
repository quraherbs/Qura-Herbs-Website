/**
 * QURA HERBS — AUTOMATIC WEBSITE ORDER SYNC WITH GOOGLE SHEETS
 * Google Apps Script Web App Endpoint
 * 
 * Spreadsheet ID: 1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk
 * Target Sheet: Orders
 */

var CONFIG = {
  SPREADSHEET_ID: "1H7iGw3w3r-LIZYe_oiYMrrUP6dyBtqweRM-tskRALlk",
  SHEET_NAME: "Orders",
  DEFAULT_SECRET: "qura_sheets_sync_secret_2026"
};

// Required 25 Columns in exact specification order
var HEADERS = [
  "Order ID",
  "Order Date and Time",
  "Customer Full Name",
  "Customer Email",
  "Customer Phone Number",
  "Complete Shipping Address",
  "City",
  "State",
  "Pincode",
  "Product Name",
  "Product ID or SKU",
  "Product Quantity",
  "Individual Product Price",
  "Subtotal",
  "Discount Amount",
  "Applied Coupon or Voucher Code",
  "Shipping Charges",
  "Final Order Total",
  "Payment Method",
  "Payment Status",
  "Order Status",
  "Transaction ID",
  "Customer Notes",
  "Order Source",
  "Google Sheets Sync Status"
];

function getSecret() {
  var prop = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  return prop || CONFIG.DEFAULT_SECRET;
}

function getTargetSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  if (!ss) {
    throw new Error("Could not open Spreadsheet with ID: " + CONFIG.SPREADSHEET_ID);
  }

  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Check if header row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaderRow(sheet);
  } else {
    // Check if first row has headers
    var firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    if (!firstRow[0] || firstRow[0].toString().trim() === "") {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      formatHeaderRow(sheet);
    }
  }

  return sheet;
}

function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  range.setBackground("#2C1A14"); // Qura Herbs Brand Dark Cocoa
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontFamily("Roboto");
  range.setFontSize(10);
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var lastRow = sheet.getLastRow();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      service: "Qura Herbs Google Sheets Order Sync",
      spreadsheet_id: CONFIG.SPREADSHEET_ID,
      sheet_name: CONFIG.SHEET_NAME,
      total_rows: Math.max(0, lastRow - 1),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Thread-safe lock: wait up to 30 seconds for concurrent requests
    lock.waitLock(30000);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Server busy: Could not acquire lock for synchronization"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing POST request body"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);

    // Authentication check
    var providedSecret = payload.secret || (e.parameter && e.parameter.secret);
    if (providedSecret !== getSecret()) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Unauthorized: Invalid or missing webhook secret"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet();
    var action = payload.action || "sync_order";

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Pong! Connected to Qura Herbs Order Management Sheet"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "update_status") {
      var result = handleUpdateStatus(sheet, payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // Default action: sync_order
    var syncResult = handleSyncOrder(sheet, payload.order);
    return ContentService.createTextOutput(JSON.stringify(syncResult)).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function handleSyncOrder(sheet, order) {
  if (!order || !order.order_id) {
    throw new Error("Missing required order data or order_id");
  }

  var orderId = order.order_id.toString().trim();
  var lastRow = sheet.getLastRow();

  // Find existing rows with this Order ID (Column 1) to prevent duplicates
  var existingRowIndices = [];
  if (lastRow > 1) {
    var orderIdValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < orderIdValues.length; i++) {
      if (orderIdValues[i][0] && orderIdValues[i][0].toString().trim() === orderId) {
        existingRowIndices.push(i + 2); // 1-indexed sheet row number
      }
    }
  }

  // If order already exists in sheet, UPDATE existing records rather than duplicating
  if (existingRowIndices.length > 0) {
    for (var r = 0; r < existingRowIndices.length; r++) {
      var rowNum = existingRowIndices[r];
      if (order.payment_status) sheet.getRange(rowNum, 20).setValue(order.payment_status);
      if (order.order_status) sheet.getRange(rowNum, 21).setValue(order.order_status);
      if (order.transaction_id) sheet.getRange(rowNum, 22).setValue(order.transaction_id);
      if (order.customer_notes) sheet.getRange(rowNum, 23).setValue(order.customer_notes);
      sheet.getRange(rowNum, 25).setValue("SYNCED");
    }

    return {
      success: true,
      order_id: orderId,
      action: "updated",
      rows_affected: existingRowIndices.length,
      message: "Order already existed in spreadsheet. Updated " + existingRowIndices.length + " matching row(s)."
    };
  }

  // If new order: construct rows for each product item
  var items = order.items && order.items.length > 0 ? order.items : [
    {
      product_name: "General Order Items",
      product_id_sku: "N/A",
      quantity: 1,
      price: order.final_total || order.subtotal || 0.0
    }
  ];

  var newRows = [];
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var row = [
      orderId,                                          // 1. Order ID
      order.order_date || new Date().toISOString(),    // 2. Order Date and Time
      order.customer_name || "",                        // 3. Customer Full Name
      order.customer_email || "",                       // 4. Customer Email
      order.customer_phone || "",                       // 5. Customer Phone Number
      order.shipping_address || "",                     // 6. Complete Shipping Address
      order.city || "",                                 // 7. City
      order.state || "",                                // 8. State
      order.pincode || "",                              // 9. Pincode
      item.product_name || "Product",                   // 10. Product Name
      item.product_id_sku || item.product_sku || "SKU", // 11. Product ID or SKU
      Number(item.quantity) || 1,                       // 12. Product Quantity
      Number(item.price) || 0.0,                        // 13. Individual Product Price
      Number(order.subtotal) || 0.0,                    // 14. Subtotal
      Number(order.discount_amount) || 0.0,             // 15. Discount Amount
      order.voucher_code || "",                         // 16. Applied Coupon or Voucher Code
      Number(order.shipping_charges) || 0.0,            // 17. Shipping Charges
      Number(order.final_total) || 0.0,                 // 18. Final Order Total
      order.payment_method || "UPI",                    // 19. Payment Method
      order.payment_status || "PAYMENT_PENDING",        // 20. Payment Status
      order.order_status || "PAYMENT_PENDING",          // 21. Order Status
      order.transaction_id || "",                       // 22. Transaction ID, if available
      order.customer_notes || "",                       // 23. Customer Notes, if available
      order.order_source || "Website",                  // 24. Order Source
      "SYNCED"                                          // 25. Google Sheets Sync Status
    ];
    newRows.push(row);
  }

  // Append new rows in bulk
  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, newRows.length, HEADERS.length).setValues(newRows);

  // Format currency columns: 13 (Price), 14 (Subtotal), 15 (Discount), 17 (Shipping), 18 (Total)
  var currencyCols = [13, 14, 15, 17, 18];
  for (var c = 0; c < currencyCols.length; c++) {
    sheet.getRange(startRow, currencyCols[c], newRows.length, 1).setNumberFormat("₹#,##0.00");
  }

  // Format alignment for Order ID, Date, Phone, Pincode, Qty, Statuses
  sheet.getRange(startRow, 1, newRows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(startRow, 2, newRows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(startRow, 5, newRows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(startRow, 9, newRows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(startRow, 12, newRows.length, 1).setHorizontalAlignment("center");
  sheet.getRange(startRow, 20, newRows.length, 2).setHorizontalAlignment("center");
  sheet.getRange(startRow, 25, newRows.length, 1).setHorizontalAlignment("center");

  return {
    success: true,
    order_id: orderId,
    action: "inserted",
    rows_affected: newRows.length,
    message: "Successfully synchronized " + newRows.length + " item row(s) to Google Sheets."
  };
}

function handleUpdateStatus(sheet, payload) {
  var orderId = payload.order_id ? payload.order_id.toString().trim() : "";
  if (!orderId) {
    throw new Error("Missing order_id for status update");
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { success: false, message: "No data rows found in spreadsheet", rows_affected: 0 };
  }

  var orderIdValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var updatedCount = 0;

  for (var i = 0; i < orderIdValues.length; i++) {
    if (orderIdValues[i][0] && orderIdValues[i][0].toString().trim() === orderId) {
      var rowNum = i + 2;
      if (payload.payment_status) sheet.getRange(rowNum, 20).setValue(payload.payment_status);
      if (payload.order_status) sheet.getRange(rowNum, 21).setValue(payload.order_status);
      if (payload.transaction_id) sheet.getRange(rowNum, 22).setValue(payload.transaction_id);
      sheet.getRange(rowNum, 25).setValue("SYNCED");
      updatedCount++;
    }
  }

  return {
    success: true,
    order_id: orderId,
    action: "updated_status",
    rows_affected: updatedCount,
    message: "Updated status for " + updatedCount + " row(s)."
  };
}
