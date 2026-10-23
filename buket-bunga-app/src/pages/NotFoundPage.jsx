/**
 * NotFoundPage.jsx — Halaman 404
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../app/routes.jsx';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">Halaman Tidak Ditemukan</h1>
      <p className="not-found__desc">
        Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link to={ROUTES.HOME} className="btn btn-primary" id="btn-back-home">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
