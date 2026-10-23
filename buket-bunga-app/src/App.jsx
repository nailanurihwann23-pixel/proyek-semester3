/**
 * App.jsx — Routing dan Provider Utama Aplikasi
 *
 * Sistem Informasi Buket Bunga
 * Phase 2: Implementasi Router, Shell Layout, dan Kerangka Halaman
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ROUTES } from './app/routes.jsx';

// Styles
import './styles/global.css';
import './styles/components.css';
import './styles/layout.css';
import './components/ui/ui.css';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

// Customer Pages
import HomePage from './pages/customer/HomePage.jsx';
import CatalogPage from './pages/customer/CatalogPage.jsx';
import ProductDetailPage from './pages/customer/ProductDetailPage.jsx';
import OrderFormPage from './pages/customer/OrderFormPage.jsx';
import OrderStatusPage from './pages/customer/OrderStatusPage.jsx';
import ContactPage from './pages/customer/ContactPage.jsx';

// Admin Pages
import LoginPage from './pages/admin/LoginPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import ProductListPage from './pages/admin/ProductListPage.jsx';
import ProductFormPage from './pages/admin/ProductFormPage.jsx';
import StockPage from './pages/admin/StockPage.jsx';
import OrderListPage from './pages/admin/OrderListPage.jsx';
import ReportPage from './pages/admin/ReportPage.jsx';

// 404
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute Area Pelanggan */}
          <Route path={ROUTES.HOME} element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="katalog" element={<CatalogPage />} />
            <Route path="katalog/:productId" element={<ProductDetailPage />} />
            <Route path="pesan" element={<OrderFormPage />} />
            <Route path="status-pesanan" element={<OrderStatusPage />} />
            <Route path="kontak" element={<ContactPage />} />
          </Route>

          {/* Rute Login Admin (Non-terproteksi, standalone) */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />

          {/* Rute Area Admin (Terproteksi dalam AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="produk" element={<ProductListPage />} />
            <Route path="produk/tambah" element={<ProductFormPage />} />
            <Route path="produk/:productId/edit" element={<ProductFormPage />} />
            <Route path="stok" element={<StockPage />} />
            <Route path="pesanan" element={<OrderListPage />} />
            <Route path="pesanan/:orderId" element={<OrderListPage />} />
            <Route path="laporan" element={<ReportPage />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
