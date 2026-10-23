/**
 * ErrorState.jsx — Komponen state error
 * Sistem Informasi Buket Bunga
 */

import './ui.css';

export default function ErrorState({
  title = 'Terjadi kesalahan',
  message,
  onRetry,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon" aria-hidden="true">⚠️</div>
      <h3 className="error-state__title">{title}</h3>
      {message && (
        <p className="error-state__desc">{message}</p>
      )}
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} id="error-retry-btn">
          Coba Lagi
        </button>
      )}
    </div>
  );
}
