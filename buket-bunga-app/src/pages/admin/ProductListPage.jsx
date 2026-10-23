/**
 * ProductListPage.jsx — Manajemen daftar produk admin (CRUD)
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, buildPath } from '../../app/routes.jsx';
import { getProducts, deleteProduct, getCategories } from '../../services/mockService.js';
import { formatRupiah } from '../../utils/currency.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal State untuk konfirmasi hapus
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Load data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [productList, categoryList] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (isMounted) {
          setProducts(productList);
          setCategories(categoryList);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat daftar produk.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  // Handle delete
  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setFeedbackMessage({
        type: 'success',
        text: `Produk "${productToDelete.name}" berhasil dihapus.`,
      });
      setProductToDelete(null);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Gagal menghapus produk.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Memuat data produk..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
            Katalog Produk Toko
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
            Kelola data nama, kategori, harga, dan stok buket bunga ({products.length} produk terdaftar).
          </p>
        </div>
        <Link to={ROUTES.ADMIN_PRODUCT_NEW} className="btn btn-primary">
          + Tambah Produk Baru
        </Link>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: feedbackMessage.type === 'success' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
            color: feedbackMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${feedbackMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{feedbackMessage.text}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
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
        {/* Search */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari berdasarkan nama produk atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label htmlFor="filter-kategori" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Kategori:
          </label>
          <select
            id="filter-kategori"
            className="form-input form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Produk */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          message={
            searchQuery || selectedCategory !== 'Semua'
              ? 'Tidak ada produk yang cocok dengan filter pencarian.'
              : 'Belum ada produk terdaftar.'
          }
          actionLabel={searchQuery || selectedCategory !== 'Semua' ? 'Reset Filter' : '+ Tambah Produk'}
          onAction={() => {
            if (searchQuery || selectedCategory !== 'Semua') {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }
          }}
        />
      ) : (
        <div className="table-wrapper card">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Visual</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th style={{ textAlign: 'center', width: '160px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id}>
                    <td>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                        }}
                      >
                        🌸
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        ID: {p.id}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                        {p.category || 'Umum'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-primary)' }}>
                      {formatRupiah(p.price)}
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-out-of-stock">Habis (0)</span>
                      ) : isLowStock ? (
                        <span className="badge badge-pending">Tersisa {p.stock}</span>
                      ) : (
                        <span className="badge badge-done">{p.stock} unit</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)' }}>
                        <Link
                          to={buildPath(ROUTES.ADMIN_PRODUCT_EDIT, { productId: p.id })}
                          className="btn btn-secondary btn-sm"
                          title="Edit Produk"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => setProductToDelete(p)}
                          title="Hapus Produk"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog Konfirmasi Hapus */}
      {productToDelete && (
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
              maxWidth: '420px',
              width: '100%',
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>🗑️</div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>
                Hapus Produk?
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                Apakah Anda yakin ingin menghapus produk <strong>"{productToDelete.name}"</strong>? Aksi ini tidak dapat dibatalkan.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
