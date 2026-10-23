/**
 * CustomerFooter.jsx — Footer area pelanggan
 * Sistem Informasi Buket Bunga
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';

const CURRENT_YEAR = new Date().getFullYear();

export default function CustomerFooter() {
  return (
    <footer className="customer-footer" role="contentinfo">
      <div className="customer-footer__inner">
        {/* Kolom brand */}
        <div>
          <div className="customer-footer__brand-name">🌸 [Nama Toko]</div>
          <p className="customer-footer__brand-desc">
            Rangkaian buket bunga segar untuk setiap momen spesial Anda.
            {/* Ganti dengan deskripsi toko asli */}
          </p>
        </div>

        {/* Kolom navigasi */}
        <div>
          <div className="customer-footer__col-title">Navigasi</div>
          <nav className="customer-footer__links" aria-label="Navigasi footer">
            <Link to={ROUTES.HOME}>Beranda</Link>
            <Link to={ROUTES.CATALOG}>Katalog</Link>
            <Link to={ROUTES.ORDER_FORM}>Pesan Sekarang</Link>
            <Link to={ROUTES.ORDER_STATUS}>Cek Status Pesanan</Link>
            <Link to={ROUTES.CONTACT}>Kontak &amp; Bantuan</Link>
          </nav>
        </div>

        {/* Kolom kontak */}
        <div>
          <div className="customer-footer__col-title">Hubungi Kami</div>
          <div className="customer-footer__links">
            <span>📞 [Nomor Telepon]</span>
            {/* Tombol WA hanya aktif jika nomor dikonfigurasi */}
            <span
              title="Nomor WhatsApp belum dikonfigurasi"
              style={{ cursor: 'default', opacity: 0.6 }}
            >
              💬 WhatsApp — <em>Segera hadir</em>
            </span>
            <span>🕐 [Jam Operasional]</span>
          </div>
        </div>
      </div>

      <div className="customer-footer__bottom">
        <span>© {CURRENT_YEAR} [Nama Toko]. Seluruh hak dilindungi.</span>
        <span className="badge-demo" role="note">⚠️ DEMO — Data mock, bukan produksi</span>
      </div>
    </footer>
  );
}
