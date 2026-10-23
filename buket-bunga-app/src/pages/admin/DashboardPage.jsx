/**
 * DashboardPage.jsx — Dashboard ringkasan operasional admin
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import { getOrders, getProducts, getReportSummary } from '../../services/mockService.js';
import { formatRupiah } from '../../utils/currency.js';
import { ORDER_STATUS } from '../../data/mockOrders.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [report, orders, products] = await Promise.all([
          getReportSummary(),
          getOrders(),
          getProducts(),
        ]);

        if (isMounted) {
          setSummary(report);
          // 5 pesanan terbaru berdasarkan createdAt descending
          const sortedOrders = [...orders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentOrders(sortedOrders.slice(0, 5));

          // Produk dengan stok <= 5
          const lowStock = products.filter((p) => p.stock <= 5);
          setLowStockProducts(lowStock);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat ringkasan dashboard.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Memuat metrik dashboard..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const pendingCount = recentOrders.filter(
    (o) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.PROCESSING
  ).length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return 'badge-pending';
      case ORDER_STATUS.PROCESSING:
        return 'badge-processing';
      case ORDER_STATUS.DONE:
        return 'badge-done';
      case ORDER_STATUS.CANCELLED:
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Banner Demo Info */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(232, 74, 127, 0.08) 0%, rgba(247, 214, 75, 0.12) 100%)',
          border: '1px solid var(--color-pink-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <div>
          <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-pink-primary)' }}>
            🌸 Selamat Datang di Panel Admin Toko Buket Bunga
          </span>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Mode Demo Aktif — Seluruh data operasional dihitung dari simulasi state in-memory.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link to={ROUTES.ADMIN_PRODUCT_NEW} className="btn btn-primary btn-sm">
            + Tambah Produk
          </Link>
          <Link to={ROUTES.HOME} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
            Lihat Toko ↗
          </Link>
        </div>
      </div>

      {/* Grid Kartu Metrik */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Metrik 1: Total Pendapatan */}
        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-pink-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Pendapatan (Selesai)
              </span>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
                {formatRupiah(summary?.totalRevenue || 0)}
              </h3>
            </div>
            <span style={{ fontSize: '1.75rem' }}>💰</span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', marginTop: 'var(--space-2)' }}>
            Dari {summary?.completedOrders || 0} pesanan terselesaikan
          </p>
        </div>

        {/* Metrik 2: Total Pesanan */}
        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-yellow-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Pesanan Masuk
              </span>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
                {summary?.totalOrders || 0} Pesanan
              </h3>
            </div>
            <span style={{ fontSize: '1.75rem' }}>📦</span>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            {summary?.totalItemsSold || 0} total buket terjual
          </p>
        </div>

        {/* Metrik 3: Pesanan Perlu Tindakan */}
        <div className="card card-body" style={{ borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pesanan Aktif
              </span>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', color: '#ea580c', marginTop: 'var(--space-1)' }}>
                {pendingCount} Menunggu/Diproses
              </h3>
            </div>
            <span style={{ fontSize: '1.75rem' }}>⏳</span>
          </div>
          <Link to={ROUTES.ADMIN_ORDERS} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-pink-primary)', marginTop: 'var(--space-2)', display: 'inline-block' }}>
            Tinjau di daftar pesanan →
          </Link>
        </div>

        {/* Metrik 4: Peringatan Stok */}
        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Peringatan Stok Menipis
              </span>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', color: lowStockProducts.length > 0 ? 'var(--color-danger)' : 'var(--color-success)', marginTop: 'var(--space-1)' }}>
                {lowStockProducts.length} Produk
              </h3>
            </div>
            <span style={{ fontSize: '1.75rem' }}>⚠️</span>
          </div>
          <Link to={ROUTES.ADMIN_STOCK} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: 'var(--space-2)', display: 'inline-block' }}>
            Kelola stok sekarang →
          </Link>
        </div>
      </div>

      {/* Row: Pesanan Terbaru & Peringatan Stok */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Kolom 1: 5 Pesanan Terbaru */}
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>Pesanan Terbaru</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Transaksi yang baru masuk ke sistem</p>
            </div>
            <Link to={ROUTES.ADMIN_ORDERS} className="btn btn-ghost btn-sm">
              Lihat Semua
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
              Belum ada data pesanan.
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Pelanggan</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.id}</td>
                      <td>
                        <div style={{ fontSize: 'var(--font-size-sm)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          {order.items?.length || 0} item
                        </div>
                      </td>
                      <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatRupiah(order.total)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kolom 2: Produk Perlu Restock */}
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                Perhatian Stok (≤ 5)
              </h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                Produk yang perlu segera ditambah persediaannya
              </p>
            </div>
            <Link to={ROUTES.ADMIN_STOCK} className="btn btn-ghost btn-sm">
              Atur Stok
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-success)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🎉</div>
              <p style={{ fontWeight: 'var(--font-weight-semibold)' }}>Semua stok produk dalam kondisi aman!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3)',
                    background: p.stock === 0 ? 'var(--color-danger-soft)' : 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${p.stock === 0 ? 'rgba(217, 72, 94, 0.3)' : 'var(--color-border)'}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      Kategori: {p.category || 'Umum'} • {formatRupiah(p.price)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge ${p.stock === 0 ? 'badge-out-of-stock' : 'badge-pending'}`}
                      style={{ fontSize: 'var(--font-size-xs)' }}
                    >
                      {p.stock === 0 ? 'Habis (0)' : `Sisa ${p.stock}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
