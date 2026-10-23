# UI Guideline — Sistem Informasi Buket Bunga

**Versi:** 1.0  
**Status:** Draft untuk persetujuan pengguna  
**Arah visual:** Modern futuristic SaaS, ramah, rapi, dan feminin tanpa terasa kekanak-kanakan.

## 1. Prinsip Desain
- **Jelas:** produk, harga, stok, status, dan tindakan utama mudah dipindai.
- **Konsisten:** tombol, form, badge status, tabel, dan kartu memakai pola yang sama.
- **Responsif:** prioritas desktop admin, tetap nyaman di layar ponsel pelanggan.
- **Fokus tugas:** admin memakai dashboard yang efisien; pelanggan mendapat pengalaman katalog yang sederhana.
- **Aksesibel:** fokus keyboard terlihat, label input jelas, kontras memadai, dan jangan hanya mengandalkan warna untuk status.

## 2. Warna Brand
Gunakan palet pink, kuning, dan putih dengan warna netral pendukung.

| Token | Nilai | Pemakaian |
|---|---|---|
| Pink utama | `#E84D8A` | CTA utama, link aktif, aksen brand |
| Pink gelap | `#B92D68` | hover/active dan teks aksen pada latar terang |
| Pink lembut | `#FCE7F0` | latar sorotan, chip lembut |
| Kuning utama | `#FFD45A` | highlight, elemen dekoratif kecil, badge perhatian |
| Kuning lembut | `#FFF5CC` | latar highlight |
| Putih | `#FFFFFF` | kartu dan permukaan utama |
| Latar | `#FFF9FC` | latar aplikasi |
| Teks utama | `#29232A` | judul dan isi utama |
| Teks sekunder | `#756B74` | keterangan dan metadata |
| Garis | `#F0DDE6` | border dan divider |
| Sukses | `#27845B` | status sukses |
| Peringatan | `#9A6500` | stok rendah/perhatian |
| Bahaya | `#C43D55` | error, hapus, pembatalan |

Pastikan teks kecil pada latar kuning/pink lembut memakai warna teks gelap, bukan putih.

## 3. Tipografi
- Font utama: `Inter` atau fallback system sans-serif.
- Judul halaman: 28–32 px desktop, 24–28 px mobile, weight 650–750.
- Judul kartu: 16–18 px, weight 600.
- Body: 14–16 px, line-height 1.5.
- Label dan metadata: 12–14 px; hindari teks penting terlalu kecil.

## 4. Layout dan Spacing
- Gunakan sistem spacing kelipatan 4/8 px.
- Konten utama desktop: max-width sekitar 1200–1280 px.
- Admin: sidebar tetap pada desktop, drawer/menu ringkas di mobile; header memuat judul halaman dan aksi akun.
- Katalog: grid 3–4 kolom desktop, 2 kolom tablet, 1–2 kolom ponsel sesuai lebar.
- Radius kartu: 16–20 px; input/tombol: 10–12 px.
- Bayangan lembut dan border tipis; hindari glassmorphism berlebihan yang menurunkan keterbacaan.

## 5. Komponen UI
### Tombol
- Primary: pink utama, teks putih, untuk aksi utama.
- Secondary: putih, border pink lembut, teks gelap.
- Accent: kuning untuk sorotan non-kritis; teks gelap.
- Danger: merah untuk hapus/batalkan.
- Semua tombol punya hover, active, disabled, dan focus state.

### Input dan Form
- Label selalu terlihat di atas input.
- Placeholder hanya contoh, bukan pengganti label.
- Pesan validasi dekat field terkait.
- File upload menampilkan nama file dan preview gambar.
- Tombol submit menampilkan state loading saat proses.

### Kartu Produk
- Foto rasio 4:3 atau 1:1, crop konsisten.
- Nama, harga IDR, ketersediaan, dan CTA jelas.
- Badge “Habis” atau “Stok terbatas” harus disertai teks.

### Tabel Admin
- Kolom ringkas, angka rata kanan bila sesuai.
- Baris memiliki hover lembut.
- Pada mobile, gunakan tabel scroll horizontal atau ubah ke kartu; jangan memotong informasi penting.

### Status Pesanan
- Menunggu Konfirmasi: kuning lembut + teks gelap.
- Diproses: pink lembut + teks pink gelap.
- Selesai: hijau lembut + teks hijau gelap.
- Dibatalkan: merah lembut + teks merah gelap.
- Status harus tetap memiliki label teks.

### Modal Konfirmasi
- Digunakan untuk tindakan destruktif seperti hapus produk.
- Menjelaskan dampak dan menyediakan tombol batal serta konfirmasi.

## 6. Struktur Halaman
### Area pelanggan
- Header dengan logo/wordmark toko, navigasi, dan CTA katalog.
- Hero dengan headline, deskripsi pendek, CTA, dan visual buket.
- Produk unggulan dalam kartu.
- Bagian alasan memilih toko / informasi layanan (konten dapat dikonfigurasi).
- Kontak dan footer.

### Area admin
- Sidebar: Dashboard, Produk, Stok, Pesanan, Laporan.
- Header: judul halaman, breadcrumb opsional, profil/logout.
- Dashboard: ringkasan metrik, pesanan terbaru, stok rendah.
- Produk: pencarian, tombol tambah, tabel/list, form tambah/edit.
- Pesanan: filter status/tanggal, daftar, detail, kontrol status.
- Laporan: metrik dan tabel transaksi.

## 7. Motion dan Gaya Futuristik
- Gunakan transisi halus 150–220 ms.
- Animasi hanya untuk feedback atau dekorasi ringan.
- Boleh memakai gradient pink-ke-kuning pada hero/aksen, tetapi jangan menjadikannya latar utama untuk blok teks panjang.
- Hormati `prefers-reduced-motion`.
- Hindari animasi berlebihan, cursor kustom, dan efek yang menghambat interaksi.

## 8. Responsif dan Aksesibilitas
- Mulai dari breakpoint praktis: 640 px, 768 px, 1024 px.
- Semua interaksi utama bisa dilakukan dengan keyboard.
- Beri `alt` deskriptif pada gambar produk.
- Gunakan heading secara berurutan dan semantik tombol/link yang tepat.
- Jangan menyampaikan status hanya melalui warna.
- Fokus terlihat dan target sentuh nyaman (sekitar 44 px).

## 9. Konten dan Gambar
- Nama toko, logo, foto produk, nomor WhatsApp, dan jam operasional belum diberikan.
- Gunakan placeholder yang mudah diganti; jangan mengklaim gambar placeholder sebagai foto produk asli.
- Foto yang tidak tersedia boleh memakai ilustrasi/placeholder yang konsisten.
- Hindari memasukkan informasi bisnis rekaan sebagai fakta.

## 10. Do / Don't
**Do**
- Tampilkan harga, stok, dan status secara konsisten.
- Pakai ruang kosong agar tampilan terasa premium.
- Buat pesan sukses/error yang singkat dan membantu.

**Don't**
- Jangan menambahkan fitur di luar PRD tanpa persetujuan.
- Jangan menggunakan warna neon pada teks kecil.
- Jangan membuat tombol tanpa fungsi.
- Jangan menyimpan kredensial admin produksi di kode frontend.
