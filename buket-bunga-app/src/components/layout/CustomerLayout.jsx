/**
 * CustomerLayout.jsx — Shell layout area pelanggan
 * Sistem Informasi Buket Bunga
 */

import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader.jsx';
import CustomerFooter from './CustomerFooter.jsx';

export default function CustomerLayout() {
  return (
    <div className="customer-layout">
      <CustomerHeader />
      <main id="main-content" className="customer-main" tabIndex={-1}>
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
