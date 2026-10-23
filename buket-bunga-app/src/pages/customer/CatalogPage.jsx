/**
 * CatalogPage.jsx — Halaman Katalog Buket Bunga
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect, useMemo } from 'react';
import { getProducts, getCategories } from '../../services/mockService.js';
import ProductCard from '../../components/customer/ProductCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
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
        if (isMounted) setError(err.message || 'Gagal memuat katalog produk.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter produk berdasarkan kategori, query pencarian, dan opsi stok
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Filter kategori
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
        return false;
      }
      // Filter hanya stok tersedia
      if (inStockOnly && item.stock <= 0) {
        return false;
      }
      // Filter query pencarian nama / deskripsi
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly]);

  function handleResetFilters() {
    setSelectedCategory('Semua');
    setSearchQuery('');
    setInStockOnly(false);
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
      {/* ── Page Header ────────────────────────────────────── */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
          Katalog Buket Bunga
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)' }}>
          Temukan rangkaian buket terbaik untuk merayakan berbagai momen berharga Anda.
        </p>
      </div>

      {/* ── Filter Bar & Pencarian ─────────────────────────── */}
      <div className="filter-bar">
        {/* Kategori Pills */}
        <div className="category-pills" role="radiogroup" aria-label="Filter kategori bunga">
          <button
            type="button"
            className={`category-pill ${selectedCategory === 'Semua' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Semua')}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input & In-stock Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <input
              type="search"
              className="form-input"
              placeholder="Cari buket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari produk buket bunga"
              style={{ paddingRight: searchQuery ? '32px' : 'var(--space-3)', height: '38px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontSize: '14px',
                }}
                aria-label="Hapus kata kunci pencarian"
              >
                ✕
              </button>
            )}
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            Hanya yang tersedia
          </label>
        </div>
      </div>

      {/* ── Ringkasan Hasil ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
        <span>
          Menampilkan <strong>{filteredProducts.length}</strong> produk
          {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
          {searchQuery && ` untuk "${searchQuery}"`}
        </span>
        {(selectedCategory !== 'Semua' || searchQuery || inStockOnly) && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleResetFilters}
            style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px', height: 'auto', minHeight: 'unset' }}
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* ── Konten Grid Produk ─────────────────────────────── */}
      {loading ? (
        <LoadingSpinner label="Memuat produk katalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon="🌸"
          title="Buket tidak ditemukan"
          description="Tidak ada buket yang cocok dengan kriteria pencarian atau filter yang Anda pilih."
          action={
            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
              Reset Pencarian &amp; Filter
            </button>
          }
        />
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
