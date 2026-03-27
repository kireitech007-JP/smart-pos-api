# Setup Supabase Realtime untuk Smart Retail POS

## Masalah yang Diselesaikan

Aplikasi Smart Retail POS Anda mengalami masalah sinkronisasi data real-time antar perangkat. Setiap perangkat hanya melihat data lokal yang tersimpan di localStorage dan tidak otomatis update saat ada perubahan dari perangkat lain.

## Solusi yang Diimplementasikan

### 1. Supabase Realtime Integration

Telah ditambahkan fitur real-time synchronization menggunakan Supabase:

- **Realtime Subscriptions**: Mendengarkan perubahan data dari semua tabel (produk, transaksi, piutang, dll)
- **Automatic Sync**: Sinkronisasi otomatis setiap 30 detik sebagai fallback
- **Manual Sync**: Tombol untuk sinkronisasi manual kapan saja
- **Connection Status**: Indikator status koneksi real-time

### 2. Komponen yang Ditambahkan

#### `src/lib/supabaseRealtime.ts`
- Setup koneksi Supabase Realtime
- Subscribe ke perubahan data
- Sync data dari Supabase ke localStorage
- Test koneksi real-time

#### `src/hooks/useSupabaseRealtime.ts`
- Custom hook untuk mengelola real-time subscriptions
- Auto-sync dengan interval yang dapat dikonfigurasi
- Event handling untuk perubahan data
- Cleanup subscriptions saat unmount

#### `src/components/RealtimeStatus.tsx`
- UI component untuk menampilkan status koneksi
- Tombol manual sync
- Indikator last sync time
- Notifikasi status koneksi

### 3. Integrasi ke Aplikasi

#### App.tsx
- Mengaktifkan real-time sync di level aplikasi
- Global sync untuk semua data

#### AdminLayout.tsx
- Status indicator di header admin
- Manual sync button

#### CashierPOS.tsx
- Status indicator di header kasir
- Real-time update untuk transaksi dan produk

## Cara Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Setup Supabase Project

1. Buat project baru di [Supabase Dashboard](https://supabase.com)
2. Copy **URL** dan **anon key** dari project settings
3. Jalankan SQL script `supabase-setup.sql` di Supabase SQL Editor

### 3. Konfigurasi di Aplikasi

1. Buka halaman **Pengaturan** di aplikasi
2. Masukkan **Supabase URL** dan **API Key**
3. Test koneksi dengan tombol "Test Connection"
4. Save settings

### 4. Enable Realtime di Supabase

Untuk setiap tabel yang ingin di-sync real-time:

```sql
-- Enable realtime untuk tabel
ALTER TABLE nama_tabel REPLICA IDENTITY FULL;

-- Atau enable untuk semua tabel
ALTER TABLE produk REPLICA IDENTITY FULL;
ALTER TABLE transaksi REPLICA IDENTITY FULL;
ALTER TABLE piutang REPLICA IDENTITY FULL;
ALTER TABLE kas_masuk REPLICA IDENTITY FULL;
ALTER TABLE pengeluaran REPLICA IDENTITY FULL;
```

## Cara Menggunakan

### 1. Monitoring Status

- **Green Badge**: Real-time aktif dan terhubung
- **Yellow Badge**: Sedang sinkronisasi
- **Red Badge**: Tidak terhubung atau error
- **Gray Badge**: Tidak ada koneksi internet

### 2. Manual Sync

Klik tombol refresh (↻) di RealtimeStatus component untuk:
- Force sync semua data dari Supabase
- Refresh state aplikasi
- Update localStorage dengan data terbaru

### 3. Test Connection

Klik tombol "Test" untuk memverifikasi koneksi Supabase Realtime.

## Troubleshooting

### Masalah: Data tidak sinkron antar perangkat

**Possible Causes:**
1. Supabase tidak dikonfigurasi dengan benar
2. Realtime tidak dienable untuk tabel
3. Tidak ada koneksi internet
4. Browser cache

**Solutions:**
1. **Check Configuration**:
   - Pastikan Supabase URL dan API Key benar
   - Test koneksi di halaman Pengaturan

2. **Enable Realtime**:
   ```sql
   ALTER TABLE produk REPLICA IDENTITY FULL;
   ```

3. **Clear Browser Cache**:
   - Clear localStorage: `localStorage.clear()`
   - Refresh halaman

4. **Check Network**:
   - Pastikan koneksi internet stabil
   - Cek browser console untuk error

### Masalah: Realtime tidak aktif

**Possible Causes:**
1. Supabase project tidak memiliki realtime enabled
2. Firewall blocking WebSocket connections
3. Browser tidak mendukung WebSocket

**Solutions:**
1. **Enable Realtime di Supabase Dashboard**:
   - Buka project settings
   - Enable "Realtime" feature

2. **Check WebSocket**:
   - Buka browser console
   - Cek error terkait WebSocket

3. **Fallback ke Polling**:
   - Aplikasi otomatis fallback ke polling setiap 30 detik
   - Data akan tetap sync meskipun realtime tidak aktif

### Masalah: Performance issues

**Possible Causes:**
1. Terlalu banyak real-time subscriptions
2. Large data transfers
3. Frequent updates

**Solutions:**
1. **Optimize Subscriptions**:
   - Subscribe hanya ke tabel yang dibutuhkan
   - Filter data dengan WHERE clauses

2. **Reduce Sync Interval**:
   ```typescript
   const { manualSync } = useSupabaseRealtime({
     enableAutoSync: true,
     syncInterval: 60000 // 60 detik
   });
   ```

3. **Implement Pagination**:
   - Limit data yang di-sync per batch
   - Implement lazy loading

## Best Practices

### 1. Data Consistency
- Selalu update Supabase langsung, bukan localStorage
- Gunakan transactions untuk multiple updates
- Implement conflict resolution

### 2. Error Handling
- Monitor connection status
- Implement retry logic
- Show user-friendly error messages

### 3. Performance Optimization
- Debounce frequent updates
- Implement data compression
- Use selective subscriptions

### 4. Security
- Enable Row Level Security (RLS)
- Use proper authentication
- Validate data on server-side

## Monitoring dan Maintenance

### 1. Log Monitoring
```javascript
// Enable debug logging
console.log('Realtime change received:', payload);
```

### 2. Performance Metrics
- Monitor sync frequency
- Track connection uptime
- Measure data transfer size

### 3. Regular Maintenance
- Update Supabase client library
- Monitor Supabase usage limits
- Backup data regularly

## FAQ

**Q: Apakah data tetap sync jika offline?**
A: Ya, aplikasi akan menyimpan perubahan di localStorage dan sync saat kembali online.

**Q: Berapa latency real-time sync?**
A: Biasanya < 100ms untuk jaringan yang baik, tergantung lokasi server Supabase.

**Q: Apakah aman menggunakan Supabase untuk production?**
A: Ya, Supabase adalah platform yang aman dengan enkripsi data dan compliance standards.

**Q: Bagaimana jika ada conflict data?**
A: Aplikasi menggunakan last-write-wins strategy. Implement conflict resolution yang lebih advanced jika dibutuhkan.
