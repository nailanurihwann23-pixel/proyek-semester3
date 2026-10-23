/**
 * routes.jsx — Definisi routing aplikasi
 *
 * Sistem Informasi Buket Bunga
 * Menggunakan React Router (akan ditambahkan di Phase 2).
 * File ini mendefinisikan daftar rute yang disetujui berdasarkan PRD.md.
 *
 * ⚠️  Phase 1: Placeholder path saja — komponen halaman dibuat di Phase 2+
 */

// ── Path constants ────────────────────────────────────────
export const ROUTES = {
  // Area pelanggan
  HOME:           '/',
  CATALOG:        '/katalog',
  PRODUCT_DETAIL: '/katalog/:productId',
  ORDER_FORM:     '/pesan',
  ORDER_STATUS:   '/status-pesanan',
  CONTACT:        '/kontak',

  // Area admin
  ADMIN_LOGIN:    '/admin/login',
  ADMIN_DASHBOARD:'/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/produk',
  ADMIN_PRODUCT_NEW:  '/admin/produk/tambah',
  ADMIN_PRODUCT_EDIT: '/admin/produk/:productId/edit',
  ADMIN_STOCK:    '/admin/stok',
  ADMIN_ORDERS:   '/admin/pesanan',
  ADMIN_ORDER_DETAIL: '/admin/pesanan/:orderId',
  ADMIN_REPORTS:  '/admin/laporan',
};

/**
 * Helper: buat path dinamis dengan parameter
 * Contoh: buildPath(ROUTES.PRODUCT_DETAIL, { productId: 'prod-001' })
 * → '/katalog/prod-001'
 */
export function buildPath(route, params = {}) {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    route
  );
}
