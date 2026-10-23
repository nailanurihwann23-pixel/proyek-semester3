/**
 * ProductCard.jsx — Kartu produk buket bunga untuk katalog dan beranda
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/currency.js';
import { ROUTES, buildPath } from '../../app/routes.jsx';

/**
 * Peta emoji / visual berdasarkan kategori
 */
const CATEGORY_EMOJI = {
  Mawar: '🌹',
  Tulip: '🌷',
  Matahari: '🌻',
  Mix: '💐',
  'Baby Breath': '🌾',
  Peony: '🌸',
};

export default function ProductCard({ product }) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const emoji = CATEGORY_EMOJI[product.category] || '💐';

  return (
    <article className="card product-card" aria-labelledby={`product-title-${product.id}`}>
      {/* Gambar/Visual Ilustrasi Produk */}
      <div className="product-card__media">
        <div className="product-card__placeholder">
          <span className="product-card__emoji" aria-hidden="true">{emoji}</span>
          <span className="product-card__category-tag">{product.category}</span>
        </div>
        {/* Badge stok overlay */}
        <div className="product-card__stock-badge">
          {isOutOfStock ? (
            <span className="badge badge-danger">Habis</span>
          ) : isLowStock ? (
            <span className="badge badge-warning">Tersisa {product.stock}</span>
          ) : (
            <span className="badge badge-success">Stok: {product.stock}</span>
          )}
        </div>
      </div>

      {/* Konten Kartu */}
      <div className="card-body product-card__body">
        <h3 id={`product-title-${product.id}`} className="product-card__title">
          {product.name}
        </h3>
        <p className="product-card__desc">
          {product.description}
        </p>

        <div className="product-card__footer">
          <div className="product-card__price-wrapper">
            <span className="product-card__price-label">Harga</span>
            <span className="product-card__price">{formatRupiah(product.price)}</span>
          </div>

          <div className="product-card__actions">
            <Link
              to={buildPath(ROUTES.PRODUCT_DETAIL, { productId: product.id })}
              className="btn btn-ghost btn-sm"
              aria-label={`Lihat detail ${product.name}`}
            >
              Detail
            </Link>
            {isOutOfStock ? (
              <button className="btn btn-secondary btn-sm" disabled aria-disabled="true">
                Habis
              </button>
            ) : (
              <Link
                to={`${ROUTES.ORDER_FORM}?productId=${product.id}`}
                className="btn btn-primary btn-sm"
                aria-label={`Pesan ${product.name}`}
              >
                Pesan
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
