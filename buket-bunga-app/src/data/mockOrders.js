/**
 * mockOrders.js — Data mock pesanan buket bunga
 *
 * ⚠️  DEMO DATA — Bukan data produksi.
 * Data ini hanya untuk keperluan tampilan/demonstrasi frontend.
 * Ganti dengan integrasi API/backend nyata sebelum ke produksi.
 */

/**
 * @typedef {'Menunggu Konfirmasi' | 'Diproses' | 'Selesai' | 'Dibatalkan'} OrderStatus
 */

export const ORDER_STATUS = {
  PENDING:    'Menunggu Konfirmasi',
  PROCESSING: 'Diproses',
  DONE:       'Selesai',
  CANCELLED:  'Dibatalkan',
};

export const MOCK_ORDERS = [
  {
    id: 'ORD-2026-001',
    customerName: 'Nama Pelanggan A',      // Placeholder — jangan gunakan nama asli
    phone: '081200000001',                 // Placeholder — jangan gunakan nomor asli
    address: 'Jl. Contoh No. 1, Kota Contoh',
    items: [
      {
        productId:            'prod-001',
        productNameSnapshot:  'Buket Mawar Merah Romantis',
        unitPriceSnapshot:    185000,
        quantity:             2,
        subtotal:             370000,
      },
    ],
    note: 'Tolong tambahkan kartu ucapan.',
    total: 370000,
    status: ORDER_STATUS.DONE,
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-02T14:00:00.000Z',
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Nama Pelanggan B',
    phone: '081200000002',
    address: 'Jl. Contoh No. 2, Kota Contoh',
    items: [
      {
        productId:            'prod-002',
        productNameSnapshot:  'Buket Tulip Pastel',
        unitPriceSnapshot:    220000,
        quantity:             1,
        subtotal:             220000,
      },
      {
        productId:            'prod-003',
        productNameSnapshot:  'Buket Matahari Ceria',
        unitPriceSnapshot:    165000,
        quantity:             1,
        subtotal:             165000,
      },
    ],
    note: '',
    total: 385000,
    status: ORDER_STATUS.PROCESSING,
    createdAt: '2026-10-05T11:00:00.000Z',
    updatedAt: '2026-10-05T13:00:00.000Z',
  },
  {
    id: 'ORD-2026-003',
    customerName: 'Nama Pelanggan C',
    phone: '081200000003',
    address: 'Jl. Contoh No. 3, Kota Contoh',
    items: [
      {
        productId:            'prod-006',
        productNameSnapshot:  'Buket Peony Premium',
        unitPriceSnapshot:    320000,
        quantity:             1,
        subtotal:             320000,
      },
    ],
    note: 'Dikemas dengan pita merah ya.',
    total: 320000,
    status: ORDER_STATUS.PENDING,
    createdAt: '2026-10-10T10:30:00.000Z',
    updatedAt: '2026-10-10T10:30:00.000Z',
  },
  {
    id: 'ORD-2026-004',
    customerName: 'Nama Pelanggan D',
    phone: '081200000004',
    address: 'Jl. Contoh No. 4, Kota Contoh',
    items: [
      {
        productId:            'prod-004',
        productNameSnapshot:  'Buket Mix Bunga Musim',
        unitPriceSnapshot:    250000,
        quantity:             1,
        subtotal:             250000,
      },
    ],
    note: '',
    total: 250000,
    status: ORDER_STATUS.CANCELLED,
    createdAt: '2026-10-08T08:00:00.000Z',
    updatedAt: '2026-10-09T09:00:00.000Z',
  },
];
