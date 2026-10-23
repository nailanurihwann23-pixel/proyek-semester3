/**
 * mockService.js — Layer service mock untuk simulasi operasi async
 *
 * ⚠️  DEMO DATA — Bukan implementasi produksi.
 * Semua fungsi mengembalikan Promise dengan delay singkat untuk
 * mensimulasikan latency jaringan. Ganti dengan API call nyata
 * saat backend tersedia.
 *
 * Sistem Informasi Buket Bunga
 */

import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockProducts.js';
import { MOCK_ORDERS, ORDER_STATUS } from '../data/mockOrders.js';

// ── State in-memory (reset saat reload) ───────────────────
let _products = structuredClone(MOCK_PRODUCTS);
let _orders   = structuredClone(MOCK_ORDERS);

/** Simulasi delay jaringan */
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// ════════════════════════════════════════════════════════════
// PRODUK
// ════════════════════════════════════════════════════════════

/** Ambil semua produk */
export async function getProducts() {
  await delay();
  return structuredClone(_products);
}

/** Ambil satu produk berdasarkan id */
export async function getProductById(id) {
  await delay();
  const product = _products.find((p) => p.id === id);
  if (!product) throw new Error(`Produk dengan id "${id}" tidak ditemukan.`);
  return structuredClone(product);
}

/** Tambah produk baru */
export async function createProduct(data) {
  await delay();
  const newProduct = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  _products.push(newProduct);
  return structuredClone(newProduct);
}

/** Edit produk */
export async function updateProduct(id, data) {
  await delay();
  const index = _products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Produk dengan id "${id}" tidak ditemukan.`);
  _products[index] = { ..._products[index], ...data, updatedAt: new Date().toISOString() };
  return structuredClone(_products[index]);
}

/** Hapus produk */
export async function deleteProduct(id) {
  await delay();
  const index = _products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Produk dengan id "${id}" tidak ditemukan.`);
  _products.splice(index, 1);
  return { success: true };
}

/** Update stok produk saja */
export async function updateStock(id, stock) {
  await delay();
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('Stok harus bilangan bulat non-negatif.');
  }
  return updateProduct(id, { stock });
}

/** Ambil daftar kategori */
export async function getCategories() {
  await delay(100);
  return structuredClone(MOCK_CATEGORIES);
}

// ════════════════════════════════════════════════════════════
// PESANAN
// ════════════════════════════════════════════════════════════

/** Ambil semua pesanan */
export async function getOrders() {
  await delay();
  return structuredClone(_orders);
}

/** Ambil pesanan berdasarkan id */
export async function getOrderById(id) {
  await delay();
  const order = _orders.find((o) => o.id === id);
  if (!order) throw new Error(`Pesanan dengan kode "${id}" tidak ditemukan.`);
  return structuredClone(order);
}

/**
 * Cek status pesanan oleh pelanggan (id + phone).
 * Tidak mengembalikan data pesanan orang lain.
 */
export async function checkOrderStatus(orderId, phone) {
  await delay();
  const order = _orders.find(
    (o) => o.id === orderId && o.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
  );
  if (!order) {
    throw new Error(
      'Pesanan tidak ditemukan. Periksa kembali kode pesanan dan nomor telepon.'
    );
  }
  // Kembalikan rincian pesanan untuk pelanggan yang terverifikasi nomor teleponnya
  return {
    id: order.id,
    status: order.status,
    customerName: order.customerName,
    items: order.items,
    total: order.total,
    address: order.address,
    note: order.note,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

/**
 * Buat pesanan baru (demo — tidak berdampak ke stok produksi).
 * ⚠️  Perubahan stok saat pesanan dibuat perlu implementasi backend nyata.
 */
export async function createOrder(data) {
  await delay(500);
  const orderCode = `ORD-${new Date().getFullYear()}-${String(_orders.length + 1).padStart(3, '0')}`;
  const newOrder = {
    ...data,
    id: orderCode,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  _orders.push(newOrder);
  return structuredClone(newOrder);
}

/** Update status pesanan */
export async function updateOrderStatus(id, status) {
  await delay();
  const validStatuses = Object.values(ORDER_STATUS);
  if (!validStatuses.includes(status)) {
    throw new Error(`Status tidak valid: "${status}".`);
  }
  const index = _orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error(`Pesanan dengan kode "${id}" tidak ditemukan.`);
  _orders[index] = { ..._orders[index], status, updatedAt: new Date().toISOString() };
  return structuredClone(_orders[index]);
}

// ════════════════════════════════════════════════════════════
// AUTH DEMO
// ════════════════════════════════════════════════════════════

/**
 * Login admin demo.
 * ⚠️  BUKAN KEAMANAN PRODUKSI — hanya demonstrasi frontend.
 * Jangan gunakan kredensial ini untuk data produksi.
 */
const DEMO_ADMIN = { username: 'admin', password: 'demo1234' };

export async function loginAdmin(username, password) {
  await delay(400);
  if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
    return { success: true, user: { username, role: 'admin' } };
  }
  throw new Error('Identitas atau kata sandi salah. Coba lagi.');
}

export async function logoutAdmin() {
  await delay(200);
  return { success: true };
}

// ════════════════════════════════════════════════════════════
// LAPORAN
// ════════════════════════════════════════════════════════════

/** Ringkasan laporan — dihitung dari data pesanan mock */
export async function getReportSummary() {
  await delay();
  const completedOrders = _orders.filter((o) => o.status === ORDER_STATUS.DONE);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = completedOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  return {
    totalOrders:    _orders.length,
    completedOrders: completedOrders.length,
    totalRevenue,
    totalItemsSold,
  };
}
