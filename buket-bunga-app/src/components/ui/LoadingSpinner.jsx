/**
 * LoadingSpinner.jsx — Komponen state loading
 * Sistem Informasi Buket Bunga
 */

import './ui.css';

export default function LoadingSpinner({ label = 'Memuat...', size = 'md' }) {
  return (
    <div className={`spinner-wrapper spinner-${size}`} role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span className="spinner-label">{label}</span>
    </div>
  );
}
