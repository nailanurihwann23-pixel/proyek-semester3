# Implementation Plan — Sistem Informasi Buket Bunga

**Versi:** 1.0  
**Status:** Draft untuk persetujuan pengguna  
**Stack frontend:** React + Vite  
**Aturan proses:** Setiap fase berhenti di checkpoint dan hanya lanjut setelah persetujuan eksplisit pengguna.

## 1. Strategi Eksekusi
Dokumen ini memecah implementasi menjadi fase kecil yang dapat ditinjau. Tidak ada fase berikutnya yang boleh dimulai otomatis. Setelah setiap fase, laporkan file yang berubah, hasil pemeriksaan, keterbatasan, dan minta persetujuan.

## 2. Fase Implementasi

### Phase 0 — Persetujuan SOT
**Tujuan:** Mengunci PRD, UI Guideline, dan Implementation Plan.  
**Aktivitas:** Tinjau ruang lingkup, asumsi, fitur, palet, dan batasan.  
**Output:** SOT disetujui atau daftar revisi.  
**Gate:** Wajib mendapat persetujuan eksplisit sebelum Phase 1.

### Phase 1 — Fondasi Proyek
**Tujuan:** Menyiapkan proyek React + Vite yang bisa dijalankan.  
**Aktivitas:**
- Buat/rapikan struktur aplikasi dan entry point.
- Siapkan routing sesuai halaman yang disetujui.
- Buat token warna, tipografi, spacing, dan komponen dasar.
- Siapkan data mock yang terpisah dari komponen UI.
- Buat README berisi cara menjalankan.
**Kriteria selesai:** `npm install` dan `npm run dev` dapat dijalankan; tidak ada error build dasar.  
**Gate:** Minta persetujuan sebelum Phase 2.

### Phase 2 — Kerangka UI dan Navigasi
**Tujuan:** Menyusun shell pelanggan dan shell admin.  
**Aktivitas:**
- Header/footer pelanggan.
- Sidebar/header admin responsif.
- Routing halaman dan navigasi aktif.
- State halaman kosong/loading/error jika relevan.
**Kriteria selesai:** Seluruh halaman inti bisa dinavigasi dengan placeholder yang jelas.  
**Gate:** Minta persetujuan sebelum Phase 3.

### Phase 3 — Halaman Pelanggan
**Tujuan:** Membuat beranda, katalog, detail produk, formulir pemesanan, cek status, dan kontak.  
**Aktivitas:**
- Tampilkan produk dari data mock.
- Implementasikan pencarian sederhana dan validasi formulir.
- Buat kode pesanan demo dan tampilan status mock.
- Jangan membuat integrasi backend/payment.
**Kriteria selesai:** Alur pelanggan bisa dicoba dari katalog sampai konfirmasi demo.  
**Gate:** Minta persetujuan sebelum Phase 4.

### Phase 4 — Halaman Admin
**Tujuan:** Membuat login demo, dashboard, manajemen produk/stok, pesanan, dan laporan.  
**Aktivitas:**
- Login demo diberi penjelasan bukan keamanan produksi.
- CRUD produk pada state/mock data.
- Update stok dengan validasi.
- Daftar/detail pesanan dan perubahan status.
- Ringkasan laporan dihitung dari data mock.
**Kriteria selesai:** Alur admin dapat diuji tanpa backend dan keterbatasan demo terlihat jelas.  
**Gate:** Minta persetujuan sebelum Phase 5.

### Phase 5 — Responsif, Aksesibilitas, dan QA
**Tujuan:** Merapikan tampilan dan memeriksa alur utama.  
**Aktivitas:**
- Uji layout pada desktop/tablet/mobile.
- Uji validasi form, status kosong, error, dan aksi destruktif.
- Periksa keyboard focus, label, alt gambar, dan kontras.
- Jalankan lint/build jika skrip tersedia.
**Kriteria selesai:** Temuan kritis diperbaiki dan hasil tes dilaporkan.  
**Gate:** Minta persetujuan sebelum Phase 6.

### Phase 6 — Handover
**Tujuan:** Menyerahkan aplikasi frontend demo dan dokumentasi.  
**Aktivitas:**
- Perbarui README dengan fitur, batasan mock, dan langkah menjalankan.
- Laporkan struktur file dan hasil QA.
- Daftar kebutuhan jika nanti ingin backend/database.
**Kriteria selesai:** Paket siap diekstrak/dijalankan sesuai instruksi, tanpa klaim backend yang belum dibuat.  
**Gate:** Tidak ada pengembangan tambahan tanpa persetujuan baru.

## 3. Struktur Folder yang Disarankan
```text
src/
  app/
    App.jsx
    routes.jsx
  components/
    ui/
    layout/
    products/
    orders/
  pages/
    customer/
    admin/
  data/
    mockProducts.js
    mockOrders.js
  services/
    mockService.js
  styles/
    tokens.css
    global.css
  utils/
    currency.js
    validation.js
public/
  images/
AGENTS.md
PRD.md
UI-GUIDELINE.md
IMPLEMENTATION_PLAN.md
PROMPT-EKSEKUSI.md
README.md
```

## 4. Aturan Teknis
- Gunakan React + Vite sebagai stack frontend.
- Pilih dependency seminimal mungkin; minta persetujuan sebelum menambah library besar.
- Pisahkan data mock, presentasi, dan logika UI.
- Gunakan komponen reusable dan nama variabel yang jelas.
- Jangan mengarang backend, API, atau kredensial.
- Jangan menyatakan autentikasi demo aman untuk produksi.
- Hindari menambahkan fitur yang tidak tertulis di PRD.
- Jangan menimpa file proyek yang sudah ada tanpa memeriksa struktur dan meminta izin bila berisiko.

## 5. Strategi Data dan Integrasi
Tahap awal menggunakan data mock lokal untuk preview. Data mock tidak menjamin persistensi setelah reload kecuali perilaku itu secara eksplisit disetujui. Backend/database, penyimpanan file, autentikasi aman, dan sinkronisasi status membutuhkan fase terpisah dengan keputusan teknologi dan persetujuan.

## 6. Pemeriksaan Minimum
- Jalankan aplikasi melalui Vite.
- Periksa error console/build bila tooling tersedia.
- Uji semua tombol utama dan navigasi.
- Uji input kosong, nilai invalid, stok nol, dan status pesanan tidak ditemukan.
- Pastikan laporan mengikuti data pesanan mock.
- Uji tampilan lebar kecil dan besar.
- Catat tes yang tidak dapat dilakukan.

## 7. Format Laporan Akhir Setiap Fase
1. **Selesai:** ringkasan hasil.
2. **File:** file dibuat/diubah.
3. **Pemeriksaan:** perintah dan hasil aktual.
4. **Batasan/risiko:** hal yang belum diimplementasikan.
5. **Checkpoint:** minta persetujuan eksplisit untuk fase berikutnya.

## 8. Protokol Persetujuan
Frasa persetujuan yang dapat diterima misalnya: “Saya setuju dengan SOT, lanjut Phase 1.” Jika pengguna meminta revisi, kerjakan revisi pada dokumen terkait dan tunggu persetujuan baru. Diam, respons ambigu, atau permintaan diskusi bukan persetujuan untuk lanjut.
