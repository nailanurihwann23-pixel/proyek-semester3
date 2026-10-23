/**
 * OrderListPage.jsx — Manajemen daftar pesanan admin
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../../services/mockService.js';
import { ORDER_STATUS } from '../../data/mockOrders.js';
import { formatRupiah } from '../../utils/currency.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function OrderListPage() {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders();
        if (isMounted) {
          // Urutkan dari pesanan terbaru
          const sorted = [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);

          // Jika ada orderId dari URL params, buka modal pesanan tersebut
          if (paramOrderId) {
            const found = sorted.find((o) => o.id === paramOrderId);
            if (found) {
              setSelectedOrder(found);
              setNewStatus(found.status);
            }
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat daftar pesanan.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [paramOrderId]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'Semua' || o.status === statusFilter;
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.phone && o.phone.includes(searchQuery));

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const closeOrderDetail = () => {
    setSelectedOrder(null);
    if (paramOrderId) {
      navigate(ROUTES.ADMIN_ORDERS);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    try {
      setUpdatingStatus(true);
      setFeedback(null);
      const updated = await updateOrderStatus(selectedOrder.id, newStatus);

      // Perbarui list pesanan di state lokal
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
      setSelectedOrder(updated);

      setFeedback({
        type: 'success',
        text: `Status pesanan ${updated.id} berhasil diperbarui menjadi "${updated.status}".`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Gagal memperbarui status pesanan.',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const formatDate = (isoString) => {
    if (!isoString) return '–';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Memuat daftar pesanan..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
          Manajemen Pesanan Masuk
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
          Tinjau pesanan pelanggan, rincian alamat pengiriman, dan perbarui tahapan status pesanan.
        </p>
      </div>

      {/* Global Feedback Toast */}
      {feedback && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: feedback.type === 'success' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
            color: feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {['Semua', ...Object.values(ORDER_STATUS)].map((status) => {
            const count =
              status === 'Semua'
                ? orders.length
                : orders.filter((o) => o.status === status).length;

            return (
              <button
                key={status}
                type="button"
                className={`category-pill ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari kode pesanan (ORD-...), nama pelanggan, atau nomor telepon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Pesanan */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          message="Tidak ditemukan pesanan dengan filter saat ini."
          actionLabel="Tampilkan Semua Pesanan"
          onAction={() => {
            setStatusFilter('Semua');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="table-wrapper card">
          <table className="table">
            <thead>
              <tr>
                <th>Kode Pesanan</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Item & Qty</th>
                <th>Total Pembayaran</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const totalItemsCount = o.items?.reduce((s, i) => s + i.quantity, 0) || 0;

                return (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-primary)' }}>
                      {o.id}
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(o.createdAt)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {o.customerName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        📞 {o.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 'var(--font-size-sm)' }}>
                        {o.items?.[0]?.productNameSnapshot || 'Buket Bunga'}
                        {o.items?.length > 1 && ` (+${o.items.length - 1} lainnya)`}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        Total {totalItemsCount} buket
                      </div>
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                      {formatRupiah(o.total)}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openOrderDetail(o)}
                      >
                        Detail & Ubah
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail & Update Status Pesanan */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 'var(--space-4)',
          }}
        >
          <div
            className="card card-body"
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Rincian Pesanan
                </span>
                <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeOrderDetail}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Info Pelanggan */}
            <div style={{ background: 'var(--color-bg)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)' }}>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pelanggan:</span>
                  <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{selectedOrder.customerName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Telepon:</span>
                  <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{selectedOrder.phone}</div>
                </div>
                <div style={{ gridColumn: 'span 2', marginTop: 'var(--space-1)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Alamat Pengiriman:</span>
                  <div>{selectedOrder.address || '–'}</div>
                </div>
                {selectedOrder.note && (
                  <div style={{ gridColumn: 'span 2', marginTop: 'var(--space-1)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Catatan Khusus:</span>
                    <div style={{ fontStyle: 'italic', color: 'var(--color-pink-primary)' }}>"{selectedOrder.note}"</div>
                  </div>
                )}
              </div>
            </div>

            {/* Item Pesanan */}
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
                Daftar Item
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-xs)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{item.productNameSnapshot}</div>
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        {formatRupiah(item.unitPriceSnapshot)} × {item.quantity} unit
                      </div>
                    </div>
                    <div style={{ fontWeight: 'var(--font-weight-bold)' }}>
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--space-3)',
                  paddingTop: 'var(--space-2)',
                  borderTop: '1px dashed var(--color-border)',
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: 'var(--font-size-base)',
                }}
              >
                <span>Total:</span>
                <span style={{ color: 'var(--color-pink-primary)' }}>{formatRupiah(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Form Ubah Status */}
            <div style={{ marginTop: 'var(--space-2)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
              <label htmlFor="select-status-order" className="form-label" style={{ marginBottom: 'var(--space-2)' }}>
                Ubah Tahapan Status:
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <select
                  id="select-status-order"
                  className="form-input form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ flex: 1 }}
                >
                  {Object.values(ORDER_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                >
                  {updatingStatus ? 'Menyimpan...' : 'Perbarui Status'}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
              <button type="button" className="btn btn-secondary" onClick={closeOrderDetail}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
