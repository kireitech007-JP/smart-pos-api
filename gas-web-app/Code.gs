// Google Apps Script untuk Smart Retail POS Web App
// File: Code.gs
// Fungsi: Backend untuk web app HTML

// Global variables
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAMES = {
  KATEGORI: "Kategori",
  SATUAN: "Satuan", 
  PRODUK: "Produk",
  PENGGUNA: "Pengguna",
  UNIT: "Unit",
  TRANSAKSI: "Transaksi",
  TRANSAKSI_ITEMS: "Transaksi Items",
  PELANGGAN: "Pelanggan",
  PIUTANG: "Piutang",
  KAS_MASUK: "Kas Masuk",
  PENGELUARAN: "Pengeluaran",
  LAPORAN: "Laporan",
  SESSIONS: "Sessions"
};

/**
 * Fungsi utama untuk serve HTML
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Smart Retail POS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fungsi untuk handle POST requests
 */
function doPost(e) {
  try {
    const postData = e.postData || e.parameter || {};
    let data;
    
    try {
      const content = postData.contents || postData;
      if (typeof content === 'string') {
        data = JSON.parse(content);
      } else if (typeof content === 'object') {
        data = content;
      } else {
        throw new Error(`Invalid content type: ${typeof content}`);
      }
    } catch (parseError) {
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }
    
    let result;
    switch (data.action) {
      case 'backupAllData':
        result = handleBackupAllData(data.data);
        break;
      case 'restoreAllData':
        result = handleRestoreAllData();
        break;
      case 'getProducts':
        result = handleGetProducts();
        break;
      case 'getTransactions':
        result = handleGetTransactions();
        break;
      case 'getCustomers':
        result = handleGetCustomers();
        break;
      case 'addProduct':
        result = handleAddProduct(data.product);
        break;
      case 'addTransaction':
        result = handleAddTransaction(data.transaction);
        break;
      case 'addCustomer':
        result = handleAddCustomer(data.customer);
        break;
      case 'updateProduct':
        result = handleUpdateProduct(data.product);
        break;
      case 'updateTransaction':
        result = handleUpdateTransaction(data.transaction);
        break;
      case 'updateCustomer':
        result = handleUpdateCustomer(data.customer);
        break;
      case 'deleteProduct':
        result = handleDeleteProduct(data.id);
        break;
      case 'deleteTransaction':
        result = handleDeleteTransaction(data.id);
        break;
      case 'deleteCustomer':
        result = handleDeleteCustomer(data.id);
        break;
      case 'getDashboardData':
        result = handleGetDashboardData();
        break;
      case 'getReport':
        result = handleGetReport(data.startDate, data.endDate);
        break;
      case 'testConnection':
        result = handleTestConnection();
        break;
      case 'autoSyncAllData':
        result = handleAutoSyncAllData(data.data);
        break;
      case 'syncSpecificData':
        result = handleSyncSpecificData(data.type, data.data);
        break;
      case 'syncTransaction':
        result = handleSyncTransaction(data.transaction);
        break;
      case 'syncProduct':
        result = handleSyncProduct(data.product);
        break;
      case 'syncDebt':
        result = handleSyncDebt(data.debt);
        break;
      case 'syncCashIn':
        result = handleSyncCashIn(data.cashIn);
        break;
      case 'syncExpense':
        result = handleSyncExpense(data.expense);
        break;
      case 'backupKategori':
        result = handleBackupKategori(data.kategori);
        break;
      case 'backupSatuan':
        result = handleBackupSatuan(data.satuan);
        break;
      case 'backupProduk':
        result = handleBackupProduk(data.produk);
        break;
      case 'backupPengguna':
        result = handleBackupPengguna(data.pengguna);
        break;
      case 'backupUnit':
        result = handleBackupUnit(data.unit);
        break;
      case 'backupTransaksi':
        result = handleBackupTransaksi(data.transaksi);
        break;
      case 'backupTransaksiItems':
        result = handleBackupTransaksiItems(data.items);
        break;
      case 'backupPiutang':
        result = handleBackupPiutang(data.piutang);
        break;
      case 'backupKasMasuk':
        result = handleBackupKasMasuk(data.kasMasuk);
        break;
      case 'backupPengeluaran':
        result = handleBackupPengeluaran(data.pengeluaran);
        break;
      case 'backupLaporan':
        result = handleBackupLaporan(data.laporan);
        break;
      case 'backupSessions':
        result = handleBackupSessions(data.sessions);
        break;
      case 'testBackupConnection':
        result = handleTestBackupConnection();
        break;
      case 'clearAllData':
        result = handleClearAllData();
        break;
      default:
        throw new Error(`Unknown action: ${data.action}`);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle get products
 */
function handleGetProducts() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = getFromSheet(spreadsheet, SHEET_NAMES.PRODUK);
    
    return {
      success: true,
      message: "Produk berhasil diambil",
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle get transactions
 */
function handleGetTransactions() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = getFromSheet(spreadsheet, SHEET_NAMES.TRANSAKSI);
    
    return {
      success: true,
      message: "Transaksi berhasil diambil",
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle get customers
 */
function handleGetCustomers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const data = getFromSheet(spreadsheet, SHEET_NAMES.PELANGGAN);
    
    return {
      success: true,
      message: "Pelanggan berhasil diambil",
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle add product
 */
function handleAddProduct(product) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.PRODUK);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.PRODUK);
      // Add headers
      const headers = ['id', 'nama', 'sku', 'kategori_id', 'satuan_id', 'harga', 'hpp', 'stok', 'min_stok', 'supplier', 'unit_id', 'created_at', 'updated_at'];
      sheet.appendRow(headers);
    }
    
    // Generate ID
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? parseInt(sheet.getRange(lastRow, 1).getValue()) + 1 : 1;
    
    // Add timestamp
    product.id = newId;
    product.created_at = new Date().toISOString();
    product.updated_at = new Date().toISOString();
    
    // Add to sheet
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => product[header] || '');
    sheet.appendRow(row);
    
    return {
      success: true,
      message: "Produk berhasil ditambahkan",
      data: product,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle add transaction
 */
function handleAddTransaction(transaction) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSAKSI);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.TRANSAKSI);
      // Add headers
      const headers = ['id', 'date', 'cashier_name', 'customer_name', 'customer_phone', 'subtotal', 'discount', 'tax', 'grand_total', 'payment_type', 'cash_paid', 'cash_change', 'dp', 'unit_id', 'created_at', 'updated_at'];
      sheet.appendRow(headers);
    }
    
    // Generate ID
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? 'TRX' + String(parseInt(sheet.getRange(lastRow, 1).getValue().replace('TRX', '')) + 1).padStart(3, '0') : 'TRX001';
    
    // Add timestamp
    transaction.id = newId;
    transaction.date = new Date().toISOString();
    transaction.created_at = new Date().toISOString();
    transaction.updated_at = new Date().toISOString();
    
    // Add to sheet
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => transaction[header] || '');
    sheet.appendRow(row);
    
    return {
      success: true,
      message: "Transaksi berhasil ditambahkan",
      data: transaction,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle add customer
 */
function handleAddCustomer(customer) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.PELANGGAN);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.PELANGGAN);
      // Add headers
      const headers = ['id', 'nama', 'telepon', 'email', 'alamat', 'created_at', 'updated_at'];
      sheet.appendRow(headers);
    }
    
    // Generate ID
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 1 ? parseInt(sheet.getRange(lastRow, 1).getValue()) + 1 : 1;
    
    // Add timestamp
    customer.id = newId;
    customer.created_at = new Date().toISOString();
    customer.updated_at = new Date().toISOString();
    
    // Add to sheet
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => customer[header] || '');
    sheet.appendRow(row);
    
    return {
      success: true,
      message: "Pelanggan berhasil ditambahkan",
      data: customer,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle update product
 */
function handleUpdateProduct(product) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.PRODUK);
    
    if (!sheet) {
      throw new Error("Sheet produk tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find product by ID
    let productIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == product.id) {
        productIndex = i;
        break;
      }
    }
    
    if (productIndex === -1) {
      throw new Error("Produk tidak ditemukan");
    }
    
    // Update timestamp
    product.updated_at = new Date().toISOString();
    
    // Update row
    const row = headers.map(header => product[header] || '');
    sheet.getRange(productIndex + 1, 1, 1, row.length).setValues([row]);
    
    return {
      success: true,
      message: "Produk berhasil diupdate",
      data: product,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle update transaction
 */
function handleUpdateTransaction(transaction) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSAKSI);
    
    if (!sheet) {
      throw new Error("Sheet transaksi tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find transaction by ID
    let transactionIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == transaction.id) {
        transactionIndex = i;
        break;
      }
    }
    
    if (transactionIndex === -1) {
      throw new Error("Transaksi tidak ditemukan");
    }
    
    // Update timestamp
    transaction.updated_at = new Date().toISOString();
    
    // Update row
    const row = headers.map(header => transaction[header] || '');
    sheet.getRange(transactionIndex + 1, 1, 1, row.length).setValues([row]);
    
    return {
      success: true,
      message: "Transaksi berhasil diupdate",
      data: transaction,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle update customer
 */
function handleUpdateCustomer(customer) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.PELANGGAN);
    
    if (!sheet) {
      throw new Error("Sheet pelanggan tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find customer by ID
    let customerIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == customer.id) {
        customerIndex = i;
        break;
      }
    }
    
    if (customerIndex === -1) {
      throw new Error("Pelanggan tidak ditemukan");
    }
    
    // Update timestamp
    customer.updated_at = new Date().toISOString();
    
    // Update row
    const row = headers.map(header => customer[header] || '');
    sheet.getRange(customerIndex + 1, 1, 1, row.length).setValues([row]);
    
    return {
      success: true,
      message: "Pelanggan berhasil diupdate",
      data: customer,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle delete product
 */
function handleDeleteProduct(id) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.PRODUK);
    
    if (!sheet) {
      throw new Error("Sheet produk tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find product by ID
    let productIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        productIndex = i;
        break;
      }
    }
    
    if (productIndex === -1) {
      throw new Error("Produk tidak ditemukan");
    }
    
    // Delete row
    sheet.deleteRow(productIndex + 1);
    
    return {
      success: true,
      message: "Produk berhasil dihapus",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle delete transaction
 */
function handleDeleteTransaction(id) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSAKSI);
    
    if (!sheet) {
      throw new Error("Sheet transaksi tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find transaction by ID
    let transactionIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        transactionIndex = i;
        break;
      }
    }
    
    if (transactionIndex === -1) {
      throw new Error("Transaksi tidak ditemukan");
    }
    
    // Delete row
    sheet.deleteRow(transactionIndex + 1);
    
    return {
      success: true,
      message: "Transaksi berhasil dihapus",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle delete customer
 */
function handleDeleteCustomer(id) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAMES.PELANGGAN);
    
    if (!sheet) {
      throw new Error("Sheet pelanggan tidak ditemukan");
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find customer by ID
    let customerIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        customerIndex = i;
        break;
      }
    }
    
    if (customerIndex === -1) {
      throw new Error("Pelanggan tidak ditemukan");
    }
    
    // Delete row
    sheet.deleteRow(customerIndex + 1);
    
    return {
      success: true,
      message: "Pelanggan berhasil dihapus",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle get dashboard data
 */
function handleGetDashboardData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Get data from sheets
    const products = getFromSheet(spreadsheet, SHEET_NAMES.PRODUK);
    const transactions = getFromSheet(spreadsheet, SHEET_NAMES.TRANSAKSI);
    const customers = getFromSheet(spreadsheet, SHEET_NAMES.PELANGGAN);
    
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => 
      t.date && t.date.startsWith(today)
    );
    
    const todayRevenue = todayTransactions.reduce((sum, t) => 
      sum + (parseFloat(t.grand_total) || 0), 0
    );
    
    return {
      success: true,
      message: "Dashboard data berhasil diambil",
      data: {
        totalProducts: products.length,
        totalTransactions: todayTransactions.length,
        totalRevenue: todayRevenue,
        totalCustomers: customers.length,
        recentTransactions: todayTransactions.slice(-5),
        lowStockProducts: products.filter(p => 
          parseInt(p.stok) < parseInt(p.min_stok || 5)
        )
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle get report
 */
function handleGetReport(startDate, endDate) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const transactions = getFromSheet(spreadsheet, SHEET_NAMES.TRANSAKSI);
    
    // Filter by date range
    const filteredTransactions = transactions.filter(t => {
      if (!t.date) return false;
      const transactionDate = t.date.split('T')[0];
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Calculate statistics
    const totalRevenue = filteredTransactions.reduce((sum, t) => 
      sum + (parseFloat(t.grand_total) || 0), 0
    );
    
    const totalTransactions = filteredTransactions.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Group by date
    const dailyStats = {};
    filteredTransactions.forEach(t => {
      const date = t.date.split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, revenue: 0 };
      }
      dailyStats[date].count++;
      dailyStats[date].revenue += parseFloat(t.grand_total) || 0;
    });
    
    return {
      success: true,
      message: "Laporan berhasil dibuat",
      data: {
        startDate: startDate,
        endDate: endDate,
        totalRevenue: totalRevenue,
        totalTransactions: totalTransactions,
        averageTransaction: averageTransaction,
        dailyStats: dailyStats,
        transactions: filteredTransactions
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup semua data
 */
function handleBackupAllData(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Backup setiap table
    if (data.products && data.products.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PRODUK, data.products);
    }
    if (data.transactions && data.transactions.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.TRANSAKSI, data.transactions);
    }
    if (data.customers && data.customers.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PELANGGAN, data.customers);
    }

    return {
      success: true,
      message: "Semua data berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle restore semua data
 */
function handleRestoreAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    const result = {
      success: true,
      message: "Data berhasil di-restore dari Google Sheets",
      data: {},
      timestamp: new Date().toISOString()
    };

    // Get data dari setiap sheet
    result.data.products = getFromSheet(spreadsheet, SHEET_NAMES.PRODUK);
    result.data.transactions = getFromSheet(spreadsheet, SHEET_NAMES.TRANSAKSI);
    result.data.customers = getFromSheet(spreadsheet, SHEET_NAMES.PELANGGAN);

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle test connection
 */
function handleTestConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = spreadsheet.getSheetName();
    
    return {
      success: true,
      message: "Koneksi Google Apps Script berhasil!",
      spreadsheetId: SPREADSHEET_ID,
      sheetName: sheetName,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Utility function untuk backup data ke sheet
 */
function backupToSheet(spreadsheet, sheetName, data) {
  try {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    
    // Clear existing data
    sheet.clear();
    
    if (data && data.length > 0) {
      // Get headers dari first object
      const headers = Object.keys(data[0]);
      
      // Prepare data array
      const dataArray = [headers];
      data.forEach(item => {
        const row = headers.map(header => item[header] || '');
        dataArray.push(row);
      });
      
      // Write data
      sheet.getRange(1, 1, dataArray.length, dataArray[0].length)
        .setValues(dataArray);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Utility function untuk get data dari sheet
 */
function getFromSheet(spreadsheet, sheetName) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return [];
    }
    
    const headers = data[0];
    const result = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    return [];
  }
}

/**
 * Function untuk setup spreadsheet pertama kali
 */
function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Create semua sheets yang dibutuhkan
    const sheetNames = Object.values(SHEET_NAMES);
    sheetNames.forEach(sheetName => {
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        Logger.log(`Created sheet: ${sheetName}`);
      }
    });
    
    return {
      success: true,
      message: "Spreadsheet setup completed",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle auto-sync semua data
 */
function handleAutoSyncAllData(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Sync semua data ke sheets
    if (data.products && data.products.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PRODUK, data.products);
    }
    if (data.transactions && data.transactions.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.TRANSAKSI, data.transactions);
    }
    if (data.debts && data.debts.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PIUTANG, data.debts);
    }
    if (data.cashIn && data.cashIn.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.KAS_MASUK, data.cashIn);
    }
    if (data.expenses && data.expenses.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PENGELUARAN, data.expenses);
    }
    if (data.categories && data.categories.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.KATEGORI, data.categories);
    }
    if (data.units && data.units.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.SATUAN, data.units);
    }
    if (data.storeUnits && data.storeUnits.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.UNIT, data.storeUnits);
    }
    if (data.users && data.users.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.PENGGUNA, data.users);
    }
    if (data.sessions && data.sessions.length > 0) {
      backupToSheet(spreadsheet, SHEET_NAMES.SESSIONS, data.sessions);
    }

    return {
      success: true,
      message: "Auto-sync semua data berhasil ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync data spesifik
 */
function handleSyncSpecificData(type, data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheetName = '';
    
    switch (type) {
      case 'products':
        sheetName = SHEET_NAMES.PRODUK;
        break;
      case 'transactions':
        sheetName = SHEET_NAMES.TRANSAKSI;
        break;
      case 'debts':
        sheetName = SHEET_NAMES.PIUTANG;
        break;
      case 'cashIn':
        sheetName = SHEET_NAMES.KAS_MASUK;
        break;
      case 'expenses':
        sheetName = SHEET_NAMES.PENGELUARAN;
        break;
      case 'categories':
        sheetName = SHEET_NAMES.KATEGORI;
        break;
      case 'units':
        sheetName = SHEET_NAMES.SATUAN;
        break;
      case 'storeUnits':
        sheetName = SHEET_NAMES.UNIT;
        break;
      case 'users':
        sheetName = SHEET_NAMES.PENGGUNA;
        break;
      case 'sessions':
        sheetName = SHEET_NAMES.SESSIONS;
        break;
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
    
    backupToSheet(spreadsheet, sheetName, data);
    
    return {
      success: true,
      message: `Data ${type} berhasil di-sync ke Google Sheets`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync transaksi real-time
 */
function handleSyncTransaction(transaction) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.TRANSAKSI);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.TRANSAKSI);
      // Add headers
      const headers = ['id', 'date', 'cashier_name', 'customer_name', 'customer_phone', 'subtotal', 'discount', 'tax', 'grand_total', 'payment_type', 'cash_paid', 'cash_change', 'dp', 'unit_id', 'unit_name', 'cashier_id', 'created_at', 'updated_at'];
      sheet.appendRow(headers);
    }
    
    // Check if transaction already exists
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let existingIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == transaction.id) {
        existingIndex = i;
        break;
      }
    }
    
    // Add timestamp
    transaction.created_at = transaction.created_at || new Date().toISOString();
    transaction.updated_at = new Date().toISOString();
    
    // Prepare row data
    const row = headers.map(header => transaction[header] || '');
    
    if (existingIndex >= 0) {
      // Update existing transaction
      sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    } else {
      // Add new transaction
      sheet.appendRow(row);
    }
    
    return {
      success: true,
      message: "Transaksi berhasil di-sync ke Google Sheets",
      data: transaction,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync produk real-time
 */
function handleSyncProduct(product) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.PRODUK);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.PRODUK);
      // Add headers
      const headers = ['id', 'supplier', 'name', 'unit', 'unitId', 'satuan', 'hpp', 'price', 'initialStock', 'addedStock', 'soldStock', 'updatedAt', 'sku', 'category_id', 'min_stock', 'unit_store_id'];
      sheet.appendRow(headers);
    }
    
    // Check if product already exists
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let existingIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == product.id) {
        existingIndex = i;
        break;
      }
    }
    
    // Add timestamp
    product.updatedAt = product.updatedAt || new Date().toISOString();
    
    // Prepare row data
    const row = headers.map(header => product[header] || '');
    
    if (existingIndex >= 0) {
      // Update existing product
      sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    } else {
      // Add new product
      sheet.appendRow(row);
    }
    
    return {
      success: true,
      message: "Produk berhasil di-sync ke Google Sheets",
      data: product,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync piutang real-time
 */
function handleSyncDebt(debt) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.PIUTANG);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.PIUTANG);
      // Add headers
      const headers = ['id', 'transactionId', 'customerName', 'customerPhone', 'totalAmount', 'dpAmount', 'remainingAmount', 'date', 'unitId', 'unitName', 'status', 'payments'];
      sheet.appendRow(headers);
    }
    
    // Check if debt already exists
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let existingIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == debt.id) {
        existingIndex = i;
        break;
      }
    }
    
    // Prepare row data
    const row = headers.map(header => {
      if (header === 'payments') {
        return JSON.stringify(debt[header] || []);
      }
      return debt[header] || '';
    });
    
    if (existingIndex >= 0) {
      // Update existing debt
      sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    } else {
      // Add new debt
      sheet.appendRow(row);
    }
    
    return {
      success: true,
      message: "Piutang berhasil di-sync ke Google Sheets",
      data: debt,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync kas masuk real-time
 */
function handleSyncCashIn(cashIn) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.KAS_MASUK);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.KAS_MASUK);
      // Add headers
      const headers = ['id', 'date', 'description', 'amount', 'depositorName', 'unitId', 'unitName', 'cashierId', 'cashierName', 'sessionId'];
      sheet.appendRow(headers);
    }
    
    // Check if cash in already exists
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let existingIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == cashIn.id) {
        existingIndex = i;
        break;
      }
    }
    
    // Prepare row data
    const row = headers.map(header => cashIn[header] || '');
    
    if (existingIndex >= 0) {
      // Update existing cash in
      sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    } else {
      // Add new cash in
      sheet.appendRow(row);
    }
    
    return {
      success: true,
      message: "Kas masuk berhasil di-sync ke Google Sheets",
      data: cashIn,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle sync pengeluaran real-time
 */
function handleSyncExpense(expense) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES.PENGELUARAN);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAMES.PENGELUARAN);
      // Add headers
      const headers = ['id', 'date', 'description', 'amount', 'unitId', 'cashierId'];
      sheet.appendRow(headers);
    }
    
    // Check if expense already exists
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let existingIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == expense.id) {
        existingIndex = i;
        break;
      }
    }
    
    // Prepare row data
    const row = headers.map(header => expense[header] || '');
    
    if (existingIndex >= 0) {
      // Update existing expense
      sheet.getRange(existingIndex + 1, 1, 1, row.length).setValues([row]);
    } else {
      // Add new expense
      sheet.appendRow(row);
    }
    
    return {
      success: true,
      message: "Pengeluaran berhasil di-sync ke Google Sheets",
      data: expense,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup kategori
 */
function handleBackupKategori(kategori) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.KATEGORI, kategori);
    
    return {
      success: true,
      message: "Kategori berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup satuan
 */
function handleBackupSatuan(satuan) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.SATUAN, satuan);
    
    return {
      success: true,
      message: "Satuan berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup produk
 */
function handleBackupProduk(produk) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.PRODUK, produk);
    
    return {
      success: true,
      message: "Produk berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup pengguna
 */
function handleBackupPengguna(pengguna) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.PENGGUNA, pengguna);
    
    return {
      success: true,
      message: "Pengguna berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup unit
 */
function handleBackupUnit(unit) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.UNIT, unit);
    
    return {
      success: true,
      message: "Unit berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup transaksi
 */
function handleBackupTransaksi(transaksi) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.TRANSAKSI, transaksi);
    
    return {
      success: true,
      message: "Transaksi berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup transaksi items
 */
function handleBackupTransaksiItems(items) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.TRANSAKSI_ITEMS, items);
    
    return {
      success: true,
      message: "Transaksi items berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup piutang
 */
function handleBackupPiutang(piutang) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.PIUTANG, piutang);
    
    return {
      success: true,
      message: "Piutang berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup kas masuk
 */
function handleBackupKasMasuk(kasMasuk) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.KAS_MASUK, kasMasuk);
    
    return {
      success: true,
      message: "Kas masuk berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup pengeluaran
 */
function handleBackupPengeluaran(pengeluaran) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.PENGELUARAN, pengeluaran);
    
    return {
      success: true,
      message: "Pengeluaran berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup laporan
 */
function handleBackupLaporan(laporan) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.LAPORAN, laporan);
    
    return {
      success: true,
      message: "Laporan berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle backup sessions
 */
function handleBackupSessions(sessions) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    backupToSheet(spreadsheet, SHEET_NAMES.SESSIONS, sessions);
    
    return {
      success: true,
      message: "Sessions berhasil di-backup ke Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle test backup connection
 */
function handleTestBackupConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = spreadsheet.getSheetName();
    
    return {
      success: true,
      message: "Koneksi Google Apps Script (Backup) berhasil!",
      spreadsheetId: SPREADSHEET_ID,
      sheetName: sheetName,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Handle clear all data
 */
function handleClearAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetNames = Object.values(SHEET_NAMES);
    
    sheetNames.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        sheet.clear();
      }
    });
    
    return {
      success: true,
      message: "Semua data berhasil di-clear dari Google Sheets",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
