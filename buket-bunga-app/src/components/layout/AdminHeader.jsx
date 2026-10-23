/**
 * AdminHeader.jsx — Header area admin
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import { useAuth } from '../../context/useAuth.js';

export default function AdminHeader({ pageTitle, breadcrumb, onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="admin-header">
      {/* Mobile menu button */}
      <button
        className="admin-header__menu-btn"
        aria-label="Buka menu navigasi"
        onClick={onMenuToggle}
        id="admin-menu-toggle"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Page title + breadcrumb */}
      <div className="admin-header__title">
        <h1 className="admin-header__page-title">{pageTitle ?? 'Dashboard'}</h1>
        {breadcrumb && (
          <nav className="admin-header__breadcrumb" aria-label="Breadcrumb">
            <Link to={ROUTES.ADMIN_DASHBOARD} style={{ color: 'inherit', textDecoration: 'none' }}>
              Admin
            </Link>
            {' / '}
            <span>{breadcrumb}</span>
          </nav>
        )}
      </div>

      {/* Actions */}
      <div className="admin-header__actions">
        {/* Demo badge */}
        <span className="badge-demo" role="status" aria-label="Mode demo aktif">
          ⚠️ Demo
        </span>
        {/* User info */}
        <div className="admin-header__user" aria-label={`Pengguna aktif: ${user?.username}`}>
          👤 {user?.username ?? 'admin'}
        </div>
      </div>
    </header>
  );
}
