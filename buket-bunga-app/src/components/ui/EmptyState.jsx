/**
 * EmptyState.jsx — Komponen state kosong/belum ada data
 * Sistem Informasi Buket Bunga
 */

import './ui.css';

export default function EmptyState({
  icon = '📭',
  title = 'Belum ada data',
  description,
  action,
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__desc">{description}</p>
      )}
      {action && (
        <div className="empty-state__action">{action}</div>
      )}
    </div>
  );
}
