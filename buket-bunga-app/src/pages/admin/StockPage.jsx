/**
 * StockPage.jsx — Manajemen stok produk admin
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { getProducts, updateStock } from '../../services/mockService.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Draft nilai stok lokal sebelum disimpan { [productId]: number }
  const [stockDrafts, setStockDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
          const initialDrafts = {};
          data.forEach((p) => {
            initialDrafts[p.id] = p.stock;
          });
          setStockDrafts(initialDrafts);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat daftar stok.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Metrik ringkasan stok
  const totalStockUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock === 0).length;
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  }, [products]);

  // Filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLowStock = filterLowStockOnly ? p.stock <= 5 : true;

      return matchSearch && matchLowStock;
    });
  }, [products, searchQuery, filterLowStockOnly]);

  const handleStockChange = (productId, newValue) => {
    const parsed = parseInt(newValue, 10);
    const valid = isNaN(parsed) ? 0 : Math.max(0, parsed);
    setStockDrafts((prev) => ({ ...prev, [productId]: valid }));
  };

  const handleStep = (productId, delta) => {
    const current = stockDrafts[productId] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setStockDrafts((prev) => ({ ...prev, [productId]: nextVal }));
  };

  const handleSaveStock = async (product) => {
    const targetStock = stockDrafts[product.id];
    if (targetStock === undefined || targetStock < 0) return;

    try {
      setSavingId(product.id);
      setFeedback(null);
      await updateStock(product.id, targetStock);

      // Perbarui data produk lokal
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: targetStock } : p))
      );

      setFeedback({
        type: 'success',
        text: `Stok produk "${product.name}" berhasil diubah menjadi ${targetStock} unit.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Gagal memperbarui stok.',
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Memuat manajemen stok..." />
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
          Manajemen Stok Buket Bunga
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
          Pantau jumlah persediaan bunga, peringatan habis, dan sesuaikan kuantitas stok secara cepat.
        </p>
      </div>

      {/* Ringkasan Status Stok */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        <div className="card card-body">
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Total Unit Tersedia
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', color: 'var(--color-text-primary)' }}>
            {totalStockUnits} Unit
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Dari {products.length} SKU buket
          </span>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Stok Menipis (1–5)
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', color: '#d97706' }}>
            {lowStockCount} Produk
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Perlu dijadwalkan restock
          </span>
        </div>

        <div className="card card-body" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Stok Habis (0)
          </span>
          <h3 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', color: 'var(--color-danger)' }}>
            {outOfStockCount} Produk
          </h3>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Tidak bisa dipesan pelanggan
          </span>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {/* Filter Bar */}
      <div
        className="card card-body"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4) var(--space-6)',
        }}
      >
        <div style={{ flex: '1 1 280px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari produk atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
          <input
            type="checkbox"
            checked={filterLowStockOnly}
            onChange={(e) => setFilterLowStockOnly(e.target.checked)}
            style={{ accentColor: 'var(--color-pink-primary)', width: '16px', height: '16px' }}
          />
          <span>Tampilkan hanya stok menipis / habis (≤ 5)</span>
        </label>
      </div>

      {/* Tabel Penyesuaian Stok */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          message="Tidak ada produk yang memenuhi kriteria pencarian stok."
          actionLabel="Reset Filter"
          onAction={() => {
            setSearchQuery('');
            setFilterLowStockOnly(false);
          }}
        />
      ) : (
        <div className="table-wrapper card">
          <table className="table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Status Stok</th>
                <th>Stok Saat Ini</th>
                <th style={{ width: '220px' }}>Sesuaikan Stok</th>
                <th style={{ textAlign: 'center', width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const currentDraft = stockDrafts[p.id] ?? p.stock;
                const hasChanged = currentDraft !== p.stock;
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>ID: {p.id}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                        {p.category || 'Umum'}
                      </span>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-out-of-stock">Habis (0)</span>
                      ) : isLowStock ? (
                        <span className="badge badge-pending">Menipis ({p.stock})</span>
                      ) : (
                        <span className="badge badge-done">Tersedia ({p.stock})</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-base)' }}>
                      {p.stock} unit
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0 var(--space-2)', minHeight: '32px' }}
                          onClick={() => handleStep(p.id, -1)}
                          disabled={currentDraft <= 0}
                          title="Kurangi 1"
                        >
                          -1
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={currentDraft}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className="form-input"
                          style={{
                            width: '75px',
                            textAlign: 'center',
                            minHeight: '32px',
                            padding: 'var(--space-1)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0 var(--space-2)', minHeight: '32px' }}
                          onClick={() => handleStep(p.id, 1)}
                          title="Tambah 1"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0 var(--space-2)', minHeight: '32px' }}
                          onClick={() => handleStep(p.id, 5)}
                          title="Tambah 5"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${hasChanged ? 'btn-primary' : 'btn-ghost'}`}
                        disabled={!hasChanged || savingId === p.id}
                        onClick={() => handleSaveStock(p)}
                        style={{ minWidth: '90px' }}
                      >
                        {savingId === p.id ? 'Menyimpan...' : hasChanged ? 'Simpan' : 'Tersimpan'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
