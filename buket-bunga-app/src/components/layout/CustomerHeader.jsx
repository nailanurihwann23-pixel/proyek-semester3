/**
 * CustomerHeader.jsx — Header area pelanggan
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';

const NAV_LINKS = [
  { to: ROUTES.HOME,         label: 'Beranda'   },
  { to: ROUTES.CATALOG,      label: 'Katalog'   },
  { to: ROUTES.ORDER_STATUS, label: 'Status Pesanan' },
  { to: ROUTES.CONTACT,      label: 'Kontak'    },
];

export default function CustomerHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="customer-header">
      <div className="customer-header__inner">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="customer-header__brand" aria-label="Kembali ke Beranda">
          <span className="customer-header__brand-icon" aria-hidden="true">🌸</span>
          <span className="customer-header__brand-name">[Nama Toko]</span>
        </Link>

        {/* Desktop nav */}
        <nav className="customer-header__nav" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                'customer-header__nav-link' + (isActive ? ' active' : '')
              }
              end={link.to === ROUTES.HOME}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="customer-header__cta">
          <Link to={ROUTES.ORDER_FORM} className="btn btn-primary btn-sm">
            Pesan Sekarang
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="customer-header__menu-btn"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        className={`customer-header__mobile-nav ${mobileOpen ? 'open' : ''}`}
        aria-label="Navigasi mobile"
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              'customer-header__nav-link' + (isActive ? ' active' : '')
            }
            end={link.to === ROUTES.HOME}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <Link
          to={ROUTES.ORDER_FORM}
          className="btn btn-primary btn-sm"
          style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}
          onClick={() => setMobileOpen(false)}
        >
          Pesan Sekarang
        </Link>
      </nav>
    </header>
  );
}
