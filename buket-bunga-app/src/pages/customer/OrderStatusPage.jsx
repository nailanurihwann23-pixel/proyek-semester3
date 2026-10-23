/**
 * OrderStatusPage.jsx — Halaman Cek Status Pesanan Buket Bunga
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { checkOrderStatus } from '../../services/mockService.js';
import { ORDER_STATUS } from '../../data/mockOrders.js';
import { formatRupiah } from '../../utils/currency.js';
import { required, validatePhone } from '../../utils/validation.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

const STATUS_STEPS = [
  { key: ORDER_STATUS.PENDING,    label: 'Menunggu Konfirmasi', icon: '⏳' },
  { key: ORDER_STATUS.PROCESSING, label: 'Sedang Dirangkai',     icon: '✂️' },
  { key: ORDER_STATUS.DONE,       label: 'Selesai / Terkirim',  icon: '🌸' },
];

export default function OrderStatusPage() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderId, setOrderId] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [errors, setErrors] = useState({});

  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Jika URL memiliki parameter kode dan nomor telepon, langsung lakukan pencarian
  useEffect(() => {
    if (initialCode && initialPhone) {
      handleSearchDirect(initialCode, initialPhone);
    }
  }, [initialCode, initialPhone]);

  async function handleSearchDirect(code, tel) {
    setLoading(true);
    setErrorMsg(null);
    setOrderResult(null);
    try {
      const data = await checkOrderStatus(code.trim(), tel.trim());
      setOrderResult(data);
    } catch (err) {
      setErrorMsg(err.message || 'Pesanan tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    const codeErr = required(orderId);
    if (codeErr) newErrors.orderId = 'Kode pesanan wajib diisi.';
    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    handleSearchDirect(orderId, phone);
  }

  // Menentukan status index stepper
  const isCancelled = orderResult?.status === ORDER_STATUS.CANCELLED;
  let currentStepIndex = 0;
  if (orderResult) {
    if (orderResult.status === ORDER_STATUS.PROCESSING) currentStepIndex = 1;
    if (orderResult.status === ORDER_STATUS.DONE) currentStepIndex = 2;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
          Lacak Status Pesanan
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Masukkan kode pesanan dan nomor telepon yang Anda daftarkan saat memesan.
        </p>
      </div>

      {/* Formulir Pencarian */}
      <form
        onSubmit={handleSubmit}
        className="card card-body"
        style={{ marginBottom: 'var(--space-8)' }}
        noValidate
        aria-label="Pencarian Status Pesanan"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="search-orderId">
              Kode Pesanan <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="search-orderId"
              type="text"
              className={`form-input ${errors.orderId ? 'error' : ''}`}
              placeholder="Contoh: ORD-2026-001"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                if (errors.orderId) setErrors((prev) => ({ ...prev, orderId: null }));
              }}
              aria-required="true"
            />
            {errors.orderId && (
              <div className="form-error" role="alert">⚠️ {errors.orderId}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="search-phone">
              Nomor Telepon / WA <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="search-phone"
              type="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Contoh: 081200000001"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
              }}
              aria-required="true"
            />
            {errors.phone && (
              <div className="form-error" role="alert">⚠️ {errors.phone}</div>
            )}
          </div>
        </div>

        <button
          id="btn-search-status"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? '🔍 Memeriksa Status...' : '🔍 Periksa Status Pesanan'}
        </button>
      </form>

      {/* Loading state */}
      {loading && <LoadingSpinner label="Sedang mencari data pesanan Anda..." />}

      {/* Error state */}
      {errorMsg && (
        <ErrorState
          title="Pesanan Tidak Ditemukan"
          message={errorMsg}
        />
      )}

      {/* Hasil Pelacakan */}
      {orderResult && (
        <div className="card card-body" style={{ padding: 'var(--space-8)' }}>
          {/* Header Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Kode Pesanan
              </span>
              <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-pink-primary)' }}>
                {orderResult.id}
              </h2>
            </div>
            <div>
              {isCancelled ? (
                <span className="badge badge-danger" style={{ fontSize: 'var(--font-size-sm)', padding: '6px 14px' }}>
                  🚫 Dibatalkan
                </span>
              ) : (
                <span
                  className={`badge ${
                    orderResult.status === ORDER_STATUS.DONE
                      ? 'badge-success'
                      : orderResult.status === ORDER_STATUS.PROCESSING
                      ? 'badge-primary'
                      : 'badge-warning'
                  }`}
                  style={{ fontSize: 'var(--font-size-sm)', padding: '6px 14px' }}
                >
                  {orderResult.status}
                </span>
              )}
            </div>
          </div>

          {/* Stepper Progres (Hanya jika tidak dibatalkan) */}
          {!isCancelled ? (
            <div className="order-stepper" aria-label="Tahapan pengerjaan pesanan">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`order-stepper__step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    <div className="order-stepper__icon" aria-hidden="true">
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <span className="order-stepper__label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                margin: 'var(--space-6) 0',
                padding: 'var(--space-4)',
                background: 'var(--color-danger-soft)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
                fontSize: 'var(--font-size-sm)',
                textAlign: 'center',
              }}
            >
              Pesanan ini telah dibatalkan oleh pihak toko atau pelanggan. Jika Anda memiliki pertanyaan, silakan hubungi kami.
            </div>
          )}

          {/* Rincian Produk & Pengiriman */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)' }}>
              Rincian Item yang Dipesan
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              {orderResult.items?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <div>
                    <strong>{item.productNameSnapshot}</strong>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {item.quantity} buket x {formatRupiah(item.unitPriceSnapshot)}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--color-pink-primary)' }}>
                    {formatRupiah(item.subtotal)}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>Penerima:</span>
                <strong>{orderResult.customerName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>Alamat Tujuan:</span>
                <span>{orderResult.address}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>Total Pembayaran:</span>
                <strong style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-pink-primary)' }}>{formatRupiah(orderResult.total)}</strong>
              </div>
            </div>

            {orderResult.note && (
              <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-pink-soft)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
                <strong>Catatan / Pesan Kartu:</strong>
                <p style={{ marginTop: '2px', fontStyle: 'italic' }}>&ldquo;{orderResult.note}&rdquo;</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
            <Link to={ROUTES.CONTACT} className="btn btn-secondary btn-sm">
              💬 Butuh Bantuan Terkait Pesanan Ini?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
