/**
 * mockProducts.js — Data mock produk buket bunga
 *
 * ⚠️  DEMO DATA — Bukan data produksi.
 * Data ini hanya untuk keperluan tampilan/demonstrasi frontend.
 * Ganti dengan integrasi API/backend nyata sebelum ke produksi.
 */

export const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Buket Mawar Merah Romantis',
    description:
      'Rangkaian buket mawar merah segar pilihan, cocok untuk hadiah ulang tahun, anniversary, atau ungkapan perasaan istimewa. Tersedia dalam kemasan premium.',
    price: 185000,
    stock: 12,
    category: 'Mawar',
    image: null, // Ganti dengan URL gambar produk asli
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'prod-002',
    name: 'Buket Tulip Pastel',
    description:
      'Kombinasi tulip warna pastel yang elegan—pink, lavender, dan putih. Tampilan modern dan feminin, ideal untuk wisuda atau hadiah apresiasi.',
    price: 220000,
    stock: 8,
    category: 'Tulip',
    image: null,
    createdAt: '2026-09-05T09:00:00.000Z',
    updatedAt: '2026-10-02T11:00:00.000Z',
  },
  {
    id: 'prod-003',
    name: 'Buket Matahari Ceria',
    description:
      'Buket penuh semangat dengan bunga matahari kuning cerah, cocok untuk ucapan selamat, perpisahan, atau menambah keceriaan hari-hari spesial.',
    price: 165000,
    stock: 5,
    category: 'Matahari',
    image: null,
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-10-03T09:00:00.000Z',
  },
  {
    id: 'prod-004',
    name: 'Buket Mix Bunga Musim',
    description:
      'Paduan bunga-bunga musiman pilihan yang disusun dengan indah. Setiap buket unik dan segar langsung dari kebun.',
    price: 250000,
    stock: 3,
    category: 'Mix',
    image: null,
    createdAt: '2026-09-15T11:00:00.000Z',
    updatedAt: '2026-10-04T14:00:00.000Z',
  },
  {
    id: 'prod-005',
    name: 'Buket Baby Breath Putih',
    description:
      'Buket minimalis elegan dari baby breath putih nan lembut. Cocok untuk wisuda, pernikahan, atau hadiah yang anggun dan timeless.',
    price: 130000,
    stock: 0, // Stok habis — contoh tampilan "Habis"
    category: 'Baby Breath',
    image: null,
    createdAt: '2026-09-20T08:30:00.000Z',
    updatedAt: '2026-10-05T08:00:00.000Z',
  },
  {
    id: 'prod-006',
    name: 'Buket Peony Premium',
    description:
      'Bunga peony mewah dengan aroma harum alami. Hadir dalam nuansa pink lembut hingga fuchsia bold. Kemasan premium ribbon satin.',
    price: 320000,
    stock: 6,
    category: 'Peony',
    image: null,
    createdAt: '2026-09-25T09:00:00.000Z',
    updatedAt: '2026-10-06T10:00:00.000Z',
  },
];

/** Daftar kategori unik dari produk mock */
export const MOCK_CATEGORIES = [
  ...new Set(MOCK_PRODUCTS.map((p) => p.category)),
];
