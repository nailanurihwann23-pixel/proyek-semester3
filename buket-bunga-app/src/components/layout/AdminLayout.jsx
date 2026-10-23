/**
 * AdminLayout.jsx — Shell layout area admin (terproteksi)
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import { ROUTES } from '../../app/routes.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

/**
 * Peta judul halaman berdasarkan path untuk AdminHeader
 */
const PAGE_TITLES = {
  [ROUTES.ADMIN_DASHBOARD]:  { title: 'Dashboard',          breadcrumb: null },
  [ROUTES.ADMIN_PRODUCTS]:   { title: 'Manajemen Produk',   breadcrumb: 'Produk' },
  [ROUTES.ADMIN_PRODUCT_NEW]:{ title: 'Tambah Produk',      breadcrumb: 'Produk / Tambah' },
  [ROUTES.ADMIN_STOCK]:      { title: 'Manajemen Stok',     breadcrumb: 'Stok' },
  [ROUTES.ADMIN_ORDERS]:     { title: 'Daftar Pesanan',     breadcrumb: 'Pesanan' },
  [ROUTES.ADMIN_REPORTS]:    { title: 'Laporan Pemesanan',  breadcrumb: 'Laporan' },
};

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Cari judul dari path saat ini
  const pageInfo = PAGE_TITLES[location.pathname] ?? { title: 'Admin', breadcrumb: null };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner label="Memeriksa sesi..." />
      </div>
    );
  }

  // Redirect ke login jika belum autentikasi
  if (!isAdmin) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace state={{ from: location }} />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Konten utama */}
      <div className="admin-content">
        <AdminHeader
          pageTitle={pageInfo.title}
          breadcrumb={pageInfo.breadcrumb}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main id="admin-main-content" className="admin-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
