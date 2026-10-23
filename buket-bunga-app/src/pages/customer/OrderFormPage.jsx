/**
 * OrderFormPage.jsx — Halaman Formulir Pemesanan Buket Bunga
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getProducts, createOrder } from '../../services/mockService.js';
import { formatRupiah } from '../../utils/currency.js';
import { required, validatePhone, validateQuantity, runValidations } from '../../utils/validation.js';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

export default function OrderFormPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedProductId = searchParams.get('productId') || '';

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form State
  const [formData, setFormData] = useState(() => ({
    customerName: '',
    phone: '',
    address: '',
    productId: preselectedProductId,
    quantity: 1,
    note: '',
  }));

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  // Muat daftar produk
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
          // Set default produk jika belum terpilih
          setFormData((prev) => {
            if (!prev.productId && data.length > 0) {
              const available = data.find((p) => p.stock > 0) || data[0];
              return { ...prev, productId: available.id };
            }
            return prev;
          });
        }
      } catch {
        // error handling handled visually
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Produk yang dipilih saat ini
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === formData.productId) || null;
  }, [products, formData.productId]);

  // Kalkulasi total
  const calculatedTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    const qty = parseInt(formData.quantity, 10) || 0;
    return selectedProduct.price * qty;
  }, [selectedProduct, formData.quantity]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value, 10) || '') : value,
    }));
    // Hapus error field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Jalankan validasi lengkap
    const validationErrors = runValidations({
      customerName: () => required(formData.customerName) || (formData.customerName.trim().length < 3 ? 'Nama minimal 3 karakter.' : null),
      phone: () => validatePhone(formData.phone),
      address: () => required(formData.address) || (formData.address.trim().length < 8 ? 'Alamat pengiriman terlalu singkat.' : null),
      productId: () => required(formData.productId),
      quantity: () => validateQuantity(formData.quantity, selectedProduct?.stock || 999),
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll ke elemen error pertama
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        note: formData.note.trim(),
        total: calculatedTotal,
        items: [
          {
            productId: selectedProduct.id,
            productNameSnapshot: selectedProduct.name,
            unitPriceSnapshot: selectedProduct.price,
            quantity: Number(formData.quantity),
            subtotal: calculatedTotal,
          },
        ],
      };

      const result = await createOrder(orderPayload);
      setOrderSuccess(result);
    } catch (err) {
      alert(err.message || 'Gagal memproses pesanan.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyOrderCode() {
    if (orderSuccess?.id) {
      navigator.clipboard.writeText(orderSuccess.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  // Layar sukses pesanan
  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-4)', maxWidth: '640px' }}>
        <div className="card card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)' }} aria-hidden="true">
            🎉
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>
            Pesanan Berhasil Dibuat!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
            Terima kasih telah memesan di [Nama Toko]. Simpan kode pesanan berikut untuk memantau status pengerjaan buket Anda.
          </p>

          {/* Kotak Kode Pesanan */}
          <div
            style={{
              background: 'var(--color-pink-soft)',
              border: '2px dashed var(--color-pink-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-pink-dark)' }}>
              Kode Pesanan Anda
            </span>
            <span
              id="order-code-display"
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-pink-primary)',
                letterSpacing: '0.05em',
              }}
            >
              {orderSuccess.id}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyOrderCode}
              style={{ marginTop: 'var(--space-1)' }}
            >
              {copied ? '✅ Tersalin!' : '📋 Salin Kode Pesanan'}
            </button>
          </div>

          {/* Rincian Ringkas */}
          <div
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              textAlign: 'left',
              fontSize: 'var(--font-size-xs)',
              marginBottom: 'var(--space-8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Pemesan:</span>
              <strong>{orderSuccess.customerName} ({orderSuccess.phone})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Produk:</span>
              <strong>{orderSuccess.items[0]?.productNameSnapshot} x {orderSuccess.items[0]?.quantity}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Total Biaya:</span>
              <strong style={{ color: 'var(--color-pink-primary)' }}>{formatRupiah(orderSuccess.total)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Alamat:</span>
              <span style={{ textAlign: 'right', maxWidth: '240px' }}>{orderSuccess.address}</span>
            </div>
          </div>

          {/* Aksi Selanjutnya */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`${ROUTES.ORDER_STATUS}?code=${orderSuccess.id}&phone=${encodeURIComponent(orderSuccess.phone)}`)}
              id="btn-goto-order-status"
            >
              🔍 Lacak Status Pesanan Ini
            </button>
            <Link to={ROUTES.CATALOG} className="btn btn-secondary">
              🌺 Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-10) var(--space-4)', maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
          Formulir Pemesanan Buket
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Isi detail data Anda dan buket yang ingin dipesan dengan teliti.
        </p>
      </div>

      {loadingProducts ? (
        <LoadingSpinner label="Menyiapkan formulir pemesanan..." />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'start',
          }}
        >
          {/* Formulir Input */}
          <form
            onSubmit={handleSubmit}
            className="card card-body"
            noValidate
            aria-label="Formulir Pemesanan Buket"
          >
            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              Data Pemesan
            </h2>

            {/* Nama Lengkap */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="field-customerName">
                Nama Lengkap <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id="field-customerName"
                name="customerName"
                type="text"
                className={`form-input ${errors.customerName ? 'error' : ''}`}
                placeholder="Contoh: Rian Anggara"
                value={formData.customerName}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={errors.customerName ? 'err-customerName' : undefined}
              />
              {errors.customerName && (
                <div id="err-customerName" className="form-error" role="alert">
                  ⚠️ {errors.customerName}
                </div>
              )}
            </div>

            {/* Nomor Telepon / WA */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="field-phone">
                Nomor WhatsApp / Telepon <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id="field-phone"
                name="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Contoh: 081234567890"
                value={formData.phone}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={errors.phone ? 'err-phone' : undefined}
              />
              {errors.phone && (
                <div id="err-phone" className="form-error" role="alert">
                  ⚠️ {errors.phone}
                </div>
              )}
            </div>

            {/* Alamat Pengiriman */}
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" htmlFor="field-address">
                Alamat Lengkap Pengiriman <span className="required" aria-hidden="true">*</span>
              </label>
              <textarea
                id="field-address"
                name="address"
                rows={3}
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan kota..."
                value={formData.address}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={errors.address ? 'err-address' : undefined}
              />
              {errors.address && (
                <div id="err-address" className="form-error" role="alert">
                  ⚠️ {errors.address}
                </div>
              )}
            </div>

            <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              Pilihan Buket Bunga
            </h2>

            {/* Dropdown Produk */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="field-productId">
                Pilih Model Buket <span className="required" aria-hidden="true">*</span>
              </label>
              <select
                id="field-productId"
                name="productId"
                className={`form-input form-select ${errors.productId ? 'error' : ''}`}
                value={formData.productId}
                onChange={handleChange}
                aria-required="true"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} — {formatRupiah(p.price)} {p.stock <= 0 ? '(Stok Habis)' : `(Sisa ${p.stock})`}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <div className="form-error" role="alert">
                  ⚠️ {errors.productId}
                </div>
              )}
            </div>

            {/* Kuantitas */}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" htmlFor="field-quantity">
                Jumlah Pesanan (Buket) <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                id="field-quantity"
                name="quantity"
                type="number"
                min={1}
                max={selectedProduct?.stock || 99}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                value={formData.quantity}
                onChange={handleChange}
                aria-required="true"
                aria-describedby={errors.quantity ? 'err-quantity' : undefined}
              />
              {errors.quantity && (
                <div id="err-quantity" className="form-error" role="alert">
                  ⚠️ {errors.quantity}
                </div>
              )}
            </div>

            {/* Catatan / Kartu Ucapan */}
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" htmlFor="field-note">
                Teks Kartu Ucapan &amp; Catatan Khusus (Opsional)
              </label>
              <textarea
                id="field-note"
                name="note"
                rows={3}
                className="form-input"
                placeholder="Tulis pesan yang ingin dicetak pada kartu ucapan (contoh: Happy Graduation, Sarah! Semoga sukses selalu)..."
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            <button
              id="btn-submit-order"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={submitting || (selectedProduct && selectedProduct.stock <= 0)}
            >
              {submitting ? '⏳ Memproses Pesanan...' : '🌸 Kirim & Konfirmasi Pesanan'}
            </button>
          </form>

          {/* Kotak Ringkasan Pesanan (Sticky) */}
          <div
            className="card card-body"
            style={{
              position: 'sticky',
              top: '90px',
              border: '1.5px solid var(--color-pink-soft)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
              Ringkasan Pembelian
            </h3>

            {selectedProduct ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                    {selectedProduct.name}
                  </span>
                  <span style={{ fontSize: 'var(--font-size-sm)' }}>
                    {formatRupiah(selectedProduct.price)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  <span>Jumlah:</span>
                  <span>{formData.quantity || 0} buket</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  <span>Kartu Ucapan:</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-medium)' }}>Gratis</span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed var(--color-border)', margin: 'var(--space-2) 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-base)' }}>
                    Estimasi Total:
                  </span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-xl)', color: 'var(--color-pink-primary)' }}>
                    {formatRupiah(calculatedTotal)}
                  </span>
                </div>

                <div
                  role="note"
                  style={{
                    background: 'var(--color-yellow-soft)',
                    border: '1px solid var(--color-yellow-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--space-3)',
                    fontSize: '11px',
                    color: 'var(--color-warning)',
                    marginTop: 'var(--space-2)',
                  }}
                >
                  ⚠️ <strong>Mode Demo:</strong> Pemesanan ini mensimulasikan pencatatan pesanan di mock service tanpa transaksi keuangan nyata.
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                Silakan pilih salah satu buket di formulir untuk melihat kalkulasi harga.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
