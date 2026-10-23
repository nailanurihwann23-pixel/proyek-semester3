# Sistem Informasi Buket Bunga

Aplikasi web untuk membantu toko buket bunga menampilkan katalog kepada pelanggan dan mengelola produk, stok, pesanan, serta laporan.

> ⚠️ **DEMO / PROTOTIPE** — Aplikasi ini menggunakan data mock dan autentikasi demo.
> Tidak ada backend, database, atau pembayaran sungguhan.
> Jangan menggunakan untuk data produksi sebelum integrasi backend selesai.

---

## Prasyarat

| Kebutuhan | Versi Minimum |
|-----------|---------------|
| Node.js   | 18.x atau lebih baru |
| npm       | 9.x atau lebih baru |

Cek versi yang terpasang:
```bash
node --version
npm --version
```

---

## Cara Menjalankan

### 1. Masuk ke direktori proyek
```bash
cd buket-bunga-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan development server
```bash
npm run dev
```

Buka browser di `http://localhost:5173` (atau port yang ditampilkan di terminal).

### 4. Build produksi (opsional)
```bash
npm run build
```

### 5. Preview build produksi
```bash
npm run preview
```

### 6. Lint
```bash
npm run lint
```

---

## Struktur Proyek

```
buket-bunga-app/
├── index.html                  # Entry HTML (lang="id", SEO dasar)
├── vite.config.js              # Konfigurasi Vite
├── package.json
├── public/
│   └── flower-icon.svg         # Favicon placeholder (ganti dengan logo toko)
└── src/
    ├── main.jsx                # Entry point React
    ├── App.jsx                 # Komponen root (Phase 1: status fondasi)
    ├── app/
    │   └── routes.jsx          # Konstanta ROUTES dan buildPath helper
    ├── components/
    │   ├── ui/                 # Komponen UI reusable (Phase 2+)
    │   ├── layout/             # Header, Sidebar, Footer (Phase 2)
    │   ├── products/           # Kartu & form produk (Phase 3+)
    │   └── orders/             # Komponen pesanan (Phase 4)
    ├── data/
    │   ├── mockProducts.js     # ⚠️ Data mock produk (6 produk contoh)
    │   └── mockOrders.js       # ⚠️ Data mock pesanan (4 pesanan contoh)
    ├── pages/
    │   ├── customer/           # Halaman area pelanggan (Phase 3)
    │   └── admin/              # Halaman area admin (Phase 4)
    ├── services/
    │   └── mockService.js      # ⚠️ Service layer mock (simulasi API)
    ├── styles/
    │   ├── tokens.css          # Design tokens: warna, tipografi, spacing
    │   └── global.css          # Reset & style global
    └── utils/
        ├── currency.js         # Format Rupiah (IDR)
        └── validation.js       # Validasi form berbahasa Indonesia
```

---

## Batasan Demo (Mock)

| Fitur | Status | Catatan |
|-------|--------|---------|
| Katalog produk | ✅ Data mock | 6 produk contoh, ganti dengan API |
| Pesanan | ✅ Data mock | 4 pesanan contoh, reset setelah reload |
| Login admin | ⚠️ Demo only | Username: `admin` / Password: `demo1234` — **bukan keamanan produksi** |
| WhatsApp | ⏳ Placeholder | Nomor belum dikonfigurasi |
| Foto produk | ⏳ Placeholder | `image: null` — ganti dengan URL gambar asli |
| Nama toko | ⏳ Placeholder | Ganti `[Nama Toko]` di seluruh project |
| Backend/API | ❌ Belum ada | Perlu keputusan teknologi terpisah |
| Pembayaran | ❌ Di luar scope | Tidak termasuk fase ini |
| Persistensi data | ❌ In-memory | Data mock reset saat halaman di-reload |

---

## Status Implementasi per Phase

| Phase | Deskripsi | Status | Catatan |
|-------|-----------|--------|---------|
| Phase 0 | Persetujuan Dokumen SOT | ✅ Selesai | PRD, UI-Guideline, & Implementation Plan terkunci |
| Phase 1 | Fondasi Proyek | ✅ Selesai | Struktur folder, token warna, style global & mock |
| Phase 2 | Kerangka UI & Navigasi | ✅ Selesai | Layout pelanggan & panel admin dengan sidebar drawer |
| Phase 3 | Halaman Pelanggan (Customer Area) | ✅ Selesai | Beranda, Katalog, Detail Produk, Form Pemesanan, Status, Kontak |
| Phase 4 | Halaman Admin (Admin Area) | ✅ Selesai | Login Demo, Dashboard, CRUD Produk, Kelola Stok, Pesanan, Laporan |
| Phase 5 | Responsif, Aksesibilitas, & QA | ✅ Selesai | Lolos uji build Vite & oxlint 0 error / 0 warning, uji fungsionalitas browser |
| Phase 6 | Handover & Dokumentasi Final | ✅ Selesai | README & panduan konfigurasi lengkap |

---

## Stack Teknologi

- **Framework:** React 19 + Vite 6
- **Styling:** CSS custom properties (Design Tokens Pink & Kuning Pastel)
- **Font:** Inter (Google Fonts)
- **Bahasa antarmuka:** Bahasa Indonesia
- **Routing:** React Router v7
- **Linter:** oxlint (0 errors, 0 warnings)

---

## Konfigurasi yang Perlu Diganti

Sebelum deploy, pastikan mengganti semua placeholder berikut:

1. **Nama toko** — cari `[Nama Toko]` di seluruh proyek
2. **Favicon** — ganti `public/flower-icon.svg` dengan logo asli
3. **Nomor WhatsApp** — konfigurasikan di file konfigurasi yang akan dibuat
4. **Foto produk** — isi field `image` di `src/data/mockProducts.js`
5. **Kredensial admin** — hapus `DEMO_ADMIN` di `mockService.js`, ganti dengan backend auth
6. **Data pelanggan** — hapus data mock, sambungkan ke backend

---

## Referensi Dokumen SOT

| Dokumen | Lokasi | Keterangan |
|---------|--------|------------|
| PRD.md | `../SOT_Sistem_Informasi_Buket_Bunga/dosc/PRD.md` | Kebutuhan produk |
| UI-GUIDELINE.md | `../SOT_Sistem_Informasi_Buket_Bunga/dosc/UI-GUIDELINE.md` | Panduan visual |
| IMPLEMENTATION_PLAN.md | `../SOT_Sistem_Informasi_Buket_Bunga/dosc/IMPLEMENTATION_PLAN.md` | Rencana fase |
| AGENTS.md | `../SOT_Sistem_Informasi_Buket_Bunga/AGENTS.md` | Kontrak kerja agen |
