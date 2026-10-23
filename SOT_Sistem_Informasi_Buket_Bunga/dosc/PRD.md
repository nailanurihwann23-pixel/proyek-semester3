# PRD — Sistem Informasi Buket Bunga

**Versi:** 1.0  
**Status:** Draft untuk persetujuan pengguna  
**Produk:** Sistem Informasi Buket Bunga berbasis web  
**Frontend:** React + Vite  
**Ruang lingkup:** Pengelolaan produk, stok, pemesanan, status pesanan, dan laporan sederhana.

## 1. Ringkasan Produk
Aplikasi web untuk membantu toko buket bunga menampilkan katalog kepada pelanggan dan mengelola produk, stok, pesanan, serta laporan melalui area admin. Aplikasi bukan marketplace dan tidak mencakup pembayaran online pada fase ini.

## 2. Tujuan
- Menyediakan katalog buket yang jelas dan mudah dijelajahi.
- Membantu admin mengelola produk dan ketersediaan stok.
- Mencatat pesanan pelanggan dan memperbarui statusnya.
- Memungkinkan pelanggan memeriksa status pesanan.
- Menampilkan ringkasan transaksi dan penjualan untuk admin.

## 3. Pengguna dan Hak Akses
### Admin
Admin harus login untuk membuka dashboard dan fitur pengelolaan. Admin dapat mengelola produk, stok, pesanan, dan laporan.

### Pelanggan
Pelanggan dapat melihat beranda dan katalog, melihat detail produk, mengirim formulir pemesanan, memeriksa status pesanan menggunakan identitas pesanan, serta membuka kontak/WhatsApp toko.

## 4. Fitur dan Kriteria Penerimaan

### A. Fitur Admin

#### A1. Login dan Logout Admin
- Form login berisi identitas admin dan kata sandi.
- Validasi input dan pesan kesalahan yang mudah dipahami.
- Halaman admin tidak dapat diakses melalui navigasi biasa sebelum autentikasi.
- Admin dapat logout dan kembali ke halaman login.
- Catatan: autentikasi produksi memerlukan backend; frontend saja hanya boleh menggunakan mock/demo yang ditandai jelas.

#### A2. Manajemen Produk Buket Bunga
- Menampilkan daftar produk dengan foto, nama, harga, stok, dan status.
- Menambah produk, mengedit informasi, menghapus dengan konfirmasi, dan melihat detail.
- Form produk memuat nama, harga, deskripsi, kategori opsional, foto, dan stok.
- Validasi nama wajib, harga tidak negatif, dan stok bilangan bulat nonnegatif.
- Unggah foto memiliki preview dan pesan jika format tidak didukung.

#### A3. Manajemen Stok Produk
- Menampilkan stok saat ini per produk.
- Admin dapat memperbarui jumlah stok.
- Stok tidak boleh kurang dari nol.
- Produk dengan stok nol ditandai “Habis” dan tidak bisa dipesan melebihi stok.

#### A4. Manajemen Pemesanan
- Daftar pesanan berisi kode pesanan, nama pelanggan, tanggal, jumlah item, total, dan status.
- Admin dapat membuka detail pesanan dan melihat data kontak, alamat, item, kuantitas, dan catatan.
- Admin dapat memperbarui status: Menunggu Konfirmasi, Diproses, Selesai, atau Dibatalkan.
- Perubahan status ditampilkan dengan label yang konsisten.
- Perubahan stok saat pesanan dibuat/dibatalkan perlu ditentukan dan diuji ketika backend diimplementasikan.

#### A5. Laporan Pemesanan
- Ringkasan jumlah pesanan, transaksi, produk terjual, dan total penjualan.
- Daftar transaksi dapat difilter berdasarkan rentang tanggal dan status.
- Angka laporan dihitung dari data pesanan, bukan angka dekoratif.
- Ekspor file tidak termasuk ruang lingkup awal kecuali disetujui kemudian.

### B. Fitur Pelanggan

#### B1. Halaman Beranda
- Menampilkan identitas toko, headline, foto/visual buket, produk unggulan, dan kontak.
- Tombol utama menuju katalog.
- Layout responsif pada desktop dan ponsel.

#### B2. Katalog dan Detail Produk
- Katalog menampilkan foto, nama, harga, ringkasan deskripsi, dan stok.
- Pelanggan dapat membuka halaman detail produk.
- Produk dapat dicari berdasarkan nama; filter kategori hanya jika kategori diaktifkan.
- Produk habis tetap dapat dilihat tetapi tidak dapat dipilih untuk pemesanan.

#### B3. Formulir Pemesanan
- Form berisi nama, nomor telepon, alamat, produk, jumlah, dan catatan khusus.
- Validasi field wajib dan format nomor telepon secara wajar.
- Jumlah harus minimal satu dan tidak melebihi stok.
- Setelah pengiriman, tampilkan ringkasan sukses dan kode pesanan yang bisa dipakai untuk mengecek status.
- Tanpa integrasi backend, pemesanan hanya demonstrasi/mock dan harus diberi label.

#### B4. Status Pemesanan
- Pelanggan memasukkan kode pesanan dan nomor telepon untuk melihat status.
- Status yang tersedia: Menunggu Konfirmasi, Diproses, Selesai, Dibatalkan.
- Jika data tidak cocok, tampilkan pesan yang tidak membocorkan data pesanan orang lain.

#### B5. Kontak dan Bantuan
- Menampilkan nomor kontak dan jam layanan jika tersedia.
- Tombol WhatsApp menggunakan nomor yang dikonfigurasi, bukan nomor yang dikarang.
- Jika nomor belum diberikan, tampilkan placeholder konfigurasi dan jangan membuat tautan aktif palsu.

## 5. Alur Utama
1. Pelanggan membuka beranda → katalog → detail produk → formulir pemesanan → menerima kode pesanan.
2. Pelanggan membuka status pesanan → memasukkan kode pesanan dan nomor telepon → melihat status.
3. Admin login → dashboard → mengelola produk/stok atau pesanan → memperbarui status → melihat laporan → logout.

## 6. Halaman yang Dibutuhkan
- Beranda pelanggan
- Katalog produk
- Detail produk
- Formulir pemesanan
- Cek status pesanan
- Kontak/bantuan
- Login admin
- Dashboard admin
- Manajemen produk
- Form tambah/edit produk
- Manajemen stok
- Daftar/detail pesanan
- Laporan pemesanan

## 7. Batasan Ruang Lingkup
Termasuk: frontend React + Vite, desain responsif, navigasi, formulir dan validasi UI, state/data mock untuk preview, dokumentasi proyek.

Tidak termasuk tanpa persetujuan terpisah: backend/API, database, pembayaran online, akun pelanggan, notifikasi SMS/email, pelacakan kurir, integrasi marketplace, multi-toko, aplikasi mobile native, dan deploy hosting.

## 8. Data Inti (Konseptual)
- **Product:** id, name, description, price, stock, image, category (opsional), createdAt, updatedAt.
- **Order:** id/orderCode, customerName, phone, address, items, note, total, status, createdAt, updatedAt.
- **OrderItem:** productId, productNameSnapshot, unitPriceSnapshot, quantity, subtotal.
- **Admin:** id, username/email, credentialHash (backend nanti; jangan simpan kata sandi asli di frontend).

## 9. Kebutuhan Nonfungsional
- Responsif dan dapat digunakan dengan keyboard.
- Kontras teks memadai, label form jelas, focus state terlihat.
- Komponen dan struktur kode mudah dirawat.
- Status loading, kosong, sukses, dan error ditangani.
- Tidak menampilkan data pelanggan secara terbuka.
- Format mata uang menggunakan Rupiah (IDR).
- Bahasa antarmuka: Bahasa Indonesia.

## 10. Asumsi dan Keputusan yang Menunggu Persetujuan
- Nama toko dan nomor WhatsApp belum ditentukan; gunakan placeholder konfigurasi.
- Backend/database belum ditentukan; tahap awal dapat memakai mock data.
- Autentikasi frontend demo bukan keamanan produksi.
- Status pesanan menggunakan empat status yang diminta.
- Tidak ada checkout/payment gateway pada ruang lingkup awal.

## 11. Definisi Selesai
- Semua fitur yang disetujui memiliki halaman atau state UI yang dapat diuji.
- Navigasi dan validasi utama berjalan.
- Tidak ada tautan/tombol utama yang inert tanpa penjelasan.
- Tampilan konsisten dengan UI Guideline.
- README menjelaskan cara menjalankan proyek dan batasan mock.
- Tidak melanjutkan ke fase implementasi sebelum persetujuan eksplisit pengguna.
