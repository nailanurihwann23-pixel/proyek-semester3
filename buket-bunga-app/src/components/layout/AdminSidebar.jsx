/**
 * AdminSidebar.jsx — Sidebar navigasi area admin
 * Sistem Informasi Buket Bunga
 */

import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import { useAuth } from '../../context/useAuth.js';

const NAV_ITEMS = [
  { to: ROUTES.ADMIN_DASHBOARD,  icon: '📊', label: 'Dashboard'         },
  { to: ROUTES.ADMIN_PRODUCTS,   icon: '🌸', label: 'Produk'            },
  { to: ROUTES.ADMIN_STOCK,      icon: '📦', label: 'Stok'              },
  { to: ROUTES.ADMIN_ORDERS,     icon: '🛒', label: 'Pesanan'           },
  { to: ROUTES.ADMIN_REPORTS,    icon: '📈', label: 'Laporan'           },
];

export default function AdminSidebar({ open, onClose }) {
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <>
      {/* Overlay untuk mobile */}
      <div
        className={`admin-sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`admin-sidebar ${open ? 'open' : ''}`}
        aria-label="Navigasi admin"
      >
        {/* Logo */}
        <Link to={ROUTES.ADMIN_DASHBOARD} className="admin-sidebar__logo" onClick={onClose}>
          <div className="admin-sidebar__logo-icon" aria-hidden="true">🌸</div>
          <div>
            <div className="admin-sidebar__logo-text">[Nama Toko]</div>
            <div className="admin-sidebar__logo-sub">Panel Admin</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="admin-sidebar__nav" aria-label="Menu admin">
          <span className="admin-sidebar__nav-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'admin-sidebar__nav-link' + (isActive ? ' active' : '')
              }
              onClick={onClose}
              end={item.to === ROUTES.ADMIN_DASHBOARD}
            >
              <span className="admin-sidebar__nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / logout */}
        <div className="admin-sidebar__footer">
          <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
            Masuk sebagai <strong>{user?.username ?? 'admin'}</strong>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%' }}
            onClick={handleLogout}
            id="admin-logout-btn"
          >
            🚪 Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
