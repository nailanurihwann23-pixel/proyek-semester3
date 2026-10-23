# Proyek Semester 3 — Sistem Informasi Buket Bunga

Repository ini berisi dokumen rancangan (*Source of Truth*) dan kode sumber aplikasi web **Sistem Informasi Buket Bunga berbasis React + Vite**.

---

## 📁 Struktur Direktori

```text
proyek-semester3/
├── SOT_Sistem_Informasi_Buket_Bunga/     # Dokumen Spesifikasi (SOT)
│   ├── dosc/
│   │   ├── PRD.md                       # Product Requirement Document
│   │   ├── UI-GUIDELINE.md              # Panduan Desain & Token Warna
│   │   └── IMPLEMENTATION_PLAN.md       # Rencana Pengerjaan per Fase
│   ├── AGENTS.md                        # Kontrak & Batasan Agen
│   └── PROMPT-EKSEKUSI.md               # Prompt Eksekusi Proyek
│
├── buket-bunga-app/                     # Kode Sumber Aplikasi Web (React + Vite)
│   ├── src/
│   │   ├── pages/                       # Area Pelanggan & Admin
│   │   ├── components/                  # Komponen UI & Layout
│   │   ├── data/                        # Mock data produk & pesanan
│   │   ├── services/                    # Service layer simulasi async
│   │   └── styles/                      # Design tokens & global CSS
│   ├── package.json
│   └── README.md                        # Dokumentasi teknis aplikasi web
│
└── README.md                            # Dokumentasi utama proyek
```

---

## 🚀 Cara Menjalankan Aplikasi Web

### 1. Masuk ke folder aplikasi
```bash
cd buket-bunga-app
```

### 2. Install dependensi
```bash
npm install
```

### 3. Jalankan server lokal
```bash
npm run dev
```

Buka peramban di: **http://localhost:5173/**

---

## 🔐 Kredensial Login Demo Admin
- **URL Login:** `http://localhost:5173/admin/login`
- **Username:** `admin`
- **Password:** `demo1234`
