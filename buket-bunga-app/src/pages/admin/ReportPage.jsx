/**
 * ReportPage.jsx — Laporan transaksi dan penjualan admin
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { getOrders } from '../../services/mockService.js';
import { ORDER_STATUS } from '../../data/mockOrders.js';
import { formatRupiah } from '../../utils/currency.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function ReportPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter
  const [statusFilter, setStatusFilter] = useState('Semua');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders();
        if (isMounted) setOrders(data);
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat data laporan.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered orders for table
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'Semua') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // Kalkulasi Metrik Nyata dari data pesanan
  const metrics = useMemo(() => {
    const totalOrdersCount = orders.length;
    const completedOrders = orders.filter((o) => o.status === ORDER_STATUS.DONE);
    const processingOrders = orders.filter((o) => o.status === ORDER_STATUS.PROCESSING);
    const pendingOrders = orders.filter((o) => o.status === ORDER_STATUS.PENDING);
    const cancelledOrders = orders.filter((o) => o.status === ORDER_STATUS.CANCELLED);

    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const totalBouquetsSold = completedOrders.reduce((sum, o) => {
      return sum + (o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0);
    }, 0);

    // Hitung produk terlaris
    const productSalesMap = {};
    completedOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const name = item.productNameSnapshot || 'Buket Bunga';
        if (!productSalesMap[name]) {
          productSalesMap[name] = { name, quantity: 0, revenue: 0 };
        }
        productSalesMap[name].quantity += item.quantity || 0;
        productSalesMap[name].revenue += item.subtotal || 0;
      });
    });

    const topProducts = Object.values(productSalesMap).sort(
      (a, b) => b.quantity - a.quantity
    );

    return {
      totalOrdersCount,
      completedOrdersCount: completedOrders.length,
      processingOrdersCount: processingOrders.length,
      pendingOrdersCount: pendingOrders.length,
      cancelledOrdersCount: cancelledOrders.length,
      totalRevenue,
      totalBouquetsSold,
      topProducts,
    };
  }, [orders]);

  const formatDate = (isoString) => {
    if (!isoString) return '–';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Menghitung laporan transaksi..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header & Print Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
            Laporan Kinerja & Penjualan Toko
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
            Ringkasan omset penjualan nyata dihitung dari akumulasi transaksi pesanan berstatus Selesai.
          </p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
          🖨️ Cetak / Simpan PDF
        </button>
      </div>

      {/* Grid Metrik Utama */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-pink-primary)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Total Omset Penjualan
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-pink-primary)', marginTop: 'var(--space-1)' }}>
            {formatRupiah(metrics.totalRevenue)}
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
            ✓ Dari {metrics.completedOrdersCount} pesanan selesai
          </span>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-yellow-primary)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Total Buket Terjual
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
            {metrics.totalBouquetsSold} Buket
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Produk terkirim ke pelanggan
          </span>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Total Semua Pesanan
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
            {metrics.totalOrdersCount} Transaksi
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            {metrics.pendingOrdersCount} menunggu, {metrics.processingOrdersCount} diproses
          </span>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Pesanan Dibatalkan
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-danger)', marginTop: 'var(--space-1)' }}>
            {metrics.cancelledOrdersCount} Pesanan
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Tidak dihitung ke omset
          </span>
        </div>
      </div>

      {/* Row: Produk Terlaris & Distribusi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Kolom 1: Produk Terlaris */}
        <div className="card card-body">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
            🌸 Produk Buket Terlaris
          </h3>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Diurutkan berdasarkan volume penjualan dari pesanan yang sukses selesai
          </p>

          {metrics.topProducts.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
              Belum ada data transaksi yang berstatus selesai.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {metrics.topProducts.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3)',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: idx === 0 ? 'var(--color-yellow-primary)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        Kontribusi: {formatRupiah(p.revenue)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-done" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                      {p.quantity} buket
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Ringkasan Status Transaksi */}
        <div className="card card-body">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
            📊 Ringkasan Status Transaksi
          </h3>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Rasio penyelesaian pemesanan toko buket
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                <span>Pesanan Selesai ({metrics.completedOrdersCount})</span>
                <span style={{ fontWeight: 'bold' }}>
                  {metrics.totalOrdersCount > 0
                    ? Math.round((metrics.completedOrdersCount / metrics.totalOrdersCount) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--color-success)',
                    width: `${metrics.totalOrdersCount > 0 ? (metrics.completedOrdersCount / metrics.totalOrdersCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                <span>Pesanan Diproses ({metrics.processingOrdersCount})</span>
                <span style={{ fontWeight: 'bold' }}>
                  {metrics.totalOrdersCount > 0
                    ? Math.round((metrics.processingOrdersCount / metrics.totalOrdersCount) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#3b82f6',
                    width: `${metrics.totalOrdersCount > 0 ? (metrics.processingOrdersCount / metrics.totalOrdersCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                <span>Menunggu Konfirmasi ({metrics.pendingOrdersCount})</span>
                <span style={{ fontWeight: 'bold' }}>
                  {metrics.totalOrdersCount > 0
                    ? Math.round((metrics.pendingOrdersCount / metrics.totalOrdersCount) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--color-warning)',
                    width: `${metrics.totalOrdersCount > 0 ? (metrics.pendingOrdersCount / metrics.totalOrdersCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', marginBottom: '4px' }}>
                <span>Pesanan Dibatalkan ({metrics.cancelledOrdersCount})</span>
                <span style={{ fontWeight: 'bold' }}>
                  {metrics.totalOrdersCount > 0
                    ? Math.round((metrics.cancelledOrdersCount / metrics.totalOrdersCount) * 100)
                    : 0}%
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--color-danger)',
                    width: `${metrics.totalOrdersCount > 0 ? (metrics.cancelledOrdersCount / metrics.totalOrdersCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Transaksi */}
      <div className="card card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
              Rincian Transaksi
            </h3>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Menampilkan {filteredOrders.length} transaksi
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select
              className="form-input form-select"
              style={{ width: 'auto', minWidth: '170px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              {Object.values(ORDER_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Item Terbeli</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Total (IDR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{o.id}</td>
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {formatDate(o.createdAt)}
                  </td>
                  <td>{o.customerName}</td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    {o.items?.map((i) => `${i.productNameSnapshot} (${i.quantity}x)`).join(', ')}
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'var(--font-weight-bold)' }}>
                    {formatRupiah(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
