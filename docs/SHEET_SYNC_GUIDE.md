# Panduan Lengkap Tombol Sheet Sync - Smart Retail POS

## 📋 Overview

Tombol **Sheet Sync** adalah fitur baru yang memungkinkan sinkronisasi otomatis data dari aplikasi Smart Retail POS ke Google Spreadsheet secara real-time. Setiap perubahan data (transaksi, produk, piutang, dll) akan otomatis terkirim ke spreadsheet yang telah dikonfigurasi.

## 🚀 Fitur Utama

### 1. **Auto-Sync Real-Time**
- Data otomatis terkirim ke Google Sheets setiap ada perubahan
- Tidak perlu klik manual - sync berjalan di background
- Mendukung semua jenis data: transaksi, produk, piutang, kas masuk, pengeluaran

### 2. **Multiple Sync Modes**
- **Auto Sync**: Sinkronisasi semua data sekaligus
- **Transaction Sync**: Sync transaksi spesifik
- **Product Sync**: Sync data produk
- **Debt Sync**: Sync data piutang
- **Cash In Sync**: Sync data kas masuk
- **Expense Sync**: Sync data pengeluaran

### 3. **Connection Status Monitoring**
- Indikator status koneksi real-time
- Notifikasi berhasil/gagal sync
- Last sync timestamp
- Error handling dan retry otomatis

## 🛠️ Setup Awal

### 1. **Install Dependencies**
```bash
npm install @supabase/supabase-js
```

### 2. **Setup Google Apps Script**
1. Buat Google Spreadsheet baru
2. Buka **Extensions > Apps Script**
3. Copy kode dari `gas-web-app/Code.gs`
4. Update `SPREADSHEET_ID` dengan ID spreadsheet Anda
5. Deploy sebagai Web App:
   - **Deploy > New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy Web App URL

### 3. **Konfigurasi di Aplikasi**
1. Buka halaman **Pengaturan**
2. Masukkan **Google Apps Script URL**
3. Test koneksi dengan tombol **Test**
4. Save settings

## 📍 Lokasi Tombol Sheet Sync

### 1. **Halaman Admin**
- Lokasi: Header bagian kanan (di sebelah RealtimeStatus)
- Mode: **Auto Sync** (sync semua data)
- Status: Full indicator dengan last sync info

### 2. **Halaman Kasir**
- Lokasi: Header bagian kanan (setelah RealtimeStatus)
- Mode: **Auto Sync** (compact mode, tanpa status detail)
- Akses: Quick sync button

## 🔧 Cara Penggunaan

### **Auto Sync Mode (Default)**
```typescript
// Sync semua data dari localStorage ke Google Sheets
<SheetSyncButton mode="auto" />
```

**Yang disinkronkan:**
- ✅ Produk (products)
- ✅ Transaksi (transactions)
- ✅ Piutang (debts)
- ✅ Kas Masuk (cashIn)
- ✅ Pengeluaran (expenses)
- ✅ Kategori (categories)
- ✅ Satuan (units)
- ✅ Unit Toko (storeUnits)
- ✅ Pengguna (users)
- ✅ Sesi Kasir (sessions)

### **Specific Data Sync**
```typescript
// Sync transaksi spesifik
<SheetSyncButton 
  mode="transaction" 
  data={transactionData}
/>

// Sync produk spesifik
<SheetSyncButton 
  mode="product" 
  data={productData}
/>
```

## 🔄 Auto-Sync Flow

### **Real-Time Triggers**
Setiap ada perubahan data, sistem akan:

1. **Update Local State**
   ```typescript
   // Contoh: submit transaction
   const newTransaction = submitTransaction(transactionData);
   ```

2. **Auto-Sync to Sheets**
   ```typescript
   // Otomatis dipanggil
   syncTransactionToSheets(newTransaction);
   ```

3. **Update UI Status**
   - Show loading indicator
   - Update last sync time
   - Show success/error notification

### **Data Flow Diagram**
```
User Action → Local State → Auto-Sync → Google Sheets → UI Update
     ↓              ↓              ↓             ↓           ↓
  Add Item    →   Update    →   Send API   →   Save    →  Notify
  Transaction     Cart          Request       Data      User
```

## 📊 Struktur Data di Google Sheets

### **Sheet Names**
- `Produk` - Data produk dan inventori
- `Transaksi` - Data transaksi penjualan
- `Piutang` - Data utang pelanggan
- `Kas Masuk` - Data pemasukan kas
- `Pengeluaran` - Data pengeluaran
- `Kategori` - Data kategori produk
- `Satuan` - Data satuan ukur
- `Unit` - Data unit/toko
- `Pengguna` - Data pengguna aplikasi
- `Sessions` - Data sesi kasir

### **Contoh Struktur Sheet Transaksi**
| id | date | cashier_name | customer_name | subtotal | grand_total | payment_type | created_at |
|----|------|--------------|----------------|-----------|--------------|---------------|-------------|
| TRX001 | 2024-03-27T10:30:00Z | John Doe | Budi Santoso | 50000 | 55000 | cash | 2024-03-27T10:30:00Z |

## ⚙️ Konfigurasi Lanjutan

### **Custom Sync Interval**
```typescript
// Di AppContext - ubah interval auto-sync
const { manualSync } = useSupabaseRealtime({
  enableAutoSync: true,
  syncInterval: 60000 // 60 detik
});
```

### **Error Handling**
```typescript
// Custom error handling
try {
  await autoSyncToSheets();
  toast.success('Data berhasil disinkronkan');
} catch (error) {
  console.error('Sync failed:', error);
  toast.error('Gagal sinkronisasi data');
}
```

### **Selective Sync**
```typescript
// Sync hanya data yang diinginkan
const selectedData = {
  products: products.filter(p => p.category === 'elektronik'),
  transactions: transactions.filter(t => 
    new Date(t.date) >= new Date('2024-03-01')
  )
};

await syncDataToSheets('selected', selectedData);
```

## 🔍 Monitoring & Troubleshooting

### **Status Indicators**
- **🟢 Hijau**: Connected & sync aktif
- **🟡 Kuning**: Sedang sinkronisasi
- **🔴 Merah**: Error atau tidak terhubung
- **⚫ Abu-abu**: Offline

### **Common Issues & Solutions**

#### **1. Connection Failed**
**Symptoms:**
- Indikator merah
- Error "Gagal terhubung ke Google Sheets"

**Solutions:**
- Check Google Apps Script URL
- Verify spreadsheet permissions
- Test koneksi manual

#### **2. Sync Timeout**
**Symptoms:**
- Loading indicator lama
- Error "Request timeout"

**Solutions:**
- Check internet connection
- Reduce data batch size
- Retry sync manually

#### **3. Data Not Syncing**
**Symptoms:**
- No error messages
- Data tidak muncul di sheets

**Solutions:**
- Clear browser cache
- Check localStorage data
- Verify Google Apps Script deployment

### **Debug Mode**
```typescript
// Enable debug logging
localStorage.setItem('debug_sheets_sync', 'true');

// Check logs
console.log('Sync debug info:', {
  lastSync: localStorage.getItem('lastSyncTime'),
  pendingData: localStorage.getItem('pendingSync'),
  errors: localStorage.getItem('syncErrors')
});
```

## 📈 Performance Optimization

### **Best Practices**
1. **Batch Sync**: Sync data dalam batch, bukan per-item
2. **Debounce**: Hindari multiple sync calls dalam waktu singkat
3. **Background Sync**: Gunakan Web Workers untuk sync besar
4. **Compression**: Compress data sebelum dikirim

### **Optimization Example**
```typescript
// Debounced sync
const debouncedSync = useMemo(
  () => debounce(autoSyncToSheets, 1000),
  []
);

// Batch sync
const batchSync = async (items) => {
  const batches = chunk(items, 50); // 50 items per batch
  for (const batch of batches) {
    await syncDataToSheets('batch', batch);
    await delay(100); // 100ms delay between batches
  }
};
```

## 🔐 Security Considerations

### **Data Protection**
- HTTPS untuk semua API calls
- No sensitive data di logs
- Rate limiting untuk sync requests
- Data validation sebelum sync

### **Access Control**
```typescript
// Validasi user permissions
const canSync = (userRole, dataType) => {
  const permissions = {
    admin: ['all'],
    cashier: ['transactions', 'cashin', 'expenses'],
    viewer: ['readonly']
  };
  
  return permissions[userRole]?.includes(dataType) || false;
};
```

## 🚀 Advanced Features

### **1. Conflict Resolution**
```typescript
// Handle sync conflicts
const resolveConflict = (localData, remoteData) => {
  // Last-write-wins strategy
  return new Date(localData.updatedAt) > new Date(remoteData.updatedAt) 
    ? localData 
    : remoteData;
};
```

### **2. Offline Support**
```typescript
// Queue sync untuk offline
const syncQueue = [];

const queueForSync = (data) => {
  syncQueue.push({
    data,
    timestamp: Date.now(),
    id: generateId()
  });
  
  localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
};

// Process queue saat online
const processSyncQueue = async () => {
  if (navigator.onLine && syncQueue.length > 0) {
    for (const item of syncQueue) {
      await syncToSheets(item.data);
    }
    syncQueue.length = 0; // Clear queue
  }
};
```

### **3. Analytics & Reporting**
```typescript
// Track sync metrics
const syncMetrics = {
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  lastSyncTime: null,
  averageSyncTime: 0
};

// Report generation
const generateSyncReport = () => {
  return {
    period: 'Last 30 days',
    totalDataPoints: syncMetrics.totalSyncs,
    successRate: (syncMetrics.successfulSyncs / syncMetrics.totalSyncs) * 100,
    averageLatency: syncMetrics.averageSyncTime,
    errors: getRecentErrors()
  };
};
```

## 📞 Support & Maintenance

### **Regular Maintenance**
1. **Weekly**: Check sync logs dan error rates
2. **Monthly**: Review Google Apps Script performance
3. **Quarterly**: Update dependencies dan security patches

### **Backup Strategy**
1. **Daily**: Auto-sync ke Google Sheets
2. **Weekly**: Export spreadsheet backup
3. **Monthly**: Full database backup

### **Contact Support**
Jika mengalami masalah:
1. Check browser console untuk error logs
2. Verify Google Apps Script deployment
3. Test dengan data sample
4. Hubungi support dengan error details

---

## 📝 Quick Reference

### **Component Props**
```typescript
interface SheetSyncButtonProps {
  mode?: 'auto' | 'transaction' | 'product' | 'debt' | 'cashin' | 'expense';
  data?: any;
  className?: string;
  showStatus?: boolean;
}
```

### **Available Functions**
```typescript
// Auto-sync semua data
autoSyncToSheets()

// Sync data spesifik
syncTransactionToSheets(transaction)
syncProductToSheets(product)
syncDebtToSheets(debt)
syncCashInToSheets(cashIn)
syncExpenseToSheets(expense)

// Test koneksi
testConnection()
```

### **Local Storage Keys**
```javascript
// Settings
localStorage.getItem('storeSettings') // Google Apps Script URL

// Sync status
localStorage.getItem('lastSyncTime') // Timestamp last sync
localStorage.getItem('syncQueue') // Offline sync queue
localStorage.getItem('syncErrors') // Error logs
```

---

**🎉 Selamat menggunakan!** Dengan tombol Sheet Sync, data Anda akan selalu tersinkronisasi dengan Google Spreadsheet secara otomatis dan real-time!
