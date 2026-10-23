/**
 * ContactPage.jsx — Halaman Kontak, Bantuan & FAQ
 * Sistem Informasi Buket Bunga
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';

// Konfigurasi nomor WhatsApp toko
// Ganti dengan nomor WhatsApp aktif berformat internasional (misal: "628123456789")
const STORE_WHATSAPP_NUMBER = null;

const FAQS = [
  {
    q: 'Berapa lama proses pembuatan dan perangkaian buket bunga?',
    a: 'Rata-rata perangkaian membutuhkan waktu 1–3 jam tergantung tingkat kerumitan desain buket. Untuk acara penting, kami menyarankan pemesanan H-1 agar ketersediaan varian bunga terjamin.',
  },
  {
    q: 'Apakah bisa meminta custom warna pembungkus (cellophane) dan pita?',
    a: 'Tentu bisa! Anda dapat menuliskan preferensi warna kertas wrapping dan pita pada kolom catatan pesanan saat mengisi formulir pemesanan.',
  },
  {
    q: 'Apakah sudah termasuk kartu ucapan gratis?',
    a: 'Ya, setiap pemesanan buket sudah disertai kartu ucapan eksklusif gratis. Anda cukup mengetikkan pesan ucapan pada kolom yang tersedia.',
  },
  {
    q: 'Bagaimana cara melacak pesanan saya?',
    a: 'Setelah membuat pesanan, Anda akan menerima Kode Pesanan (misal: ORD-2026-001). Masukkan kode tersebut dan nomor telepon Anda pada halaman Status Pesanan untuk melihat prosesnya secara real-time.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', contact: '', message: '' });

  function toggleFaq(index) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  function handleSendInquiry(e) {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.message) return;
    setInquirySent(true);
    setInquiryForm({ name: '', contact: '', message: '' });
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
          Kontak &amp; Pusat Bantuan
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', maxWidth: '560px', margin: '0 auto' }}>
          Kami siap membantu mewujudkan rangkaian bunga impian Anda. Hubungi kami melalui kanal di bawah atau baca tanya-jawab populer.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)',
        }}
      >
        {/* Kartu Informasi Toko */}
        <div className="card card-body" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
            Informasi Florist
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.25rem' }} aria-hidden="true">📍</span>
              <div>
                <strong>Alamat Toko &amp; Workshop</strong>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                  [Alamat Toko Florist, Jalan Raya Mawar No. 123, Kota Anda]
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.25rem' }} aria-hidden="true">🕐</span>
              <div>
                <strong>Jam Operasional</strong>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                  Senin – Sabtu: 08.00 – 18.00 WIB<br />
                  Minggu / Hari Libur: 09.00 – 15.00 WIB
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '1.25rem' }} aria-hidden="true">📞</span>
              <div>
                <strong>Layanan Telepon</strong>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                  [Nomor Telepon: 0812-XXXX-XXXX]
                </p>
              </div>
            </div>
          </div>

          {/* Tombol WhatsApp (Dengan status konfigurasi sesuai aturan SOT) */}
          <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px dashed var(--color-border)' }}>
            {STORE_WHATSAPP_NUMBER ? (
              <a
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=Halo%20Florist,%20saya%20ingin%20bertanya%20tentang%20buket%20bunga`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                💬 Chat WhatsApp Toko
              </a>
            ) : (
              <div
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <span style={{ fontSize: '1.5rem', opacity: 0.5 }} aria-hidden="true">💬</span>
                <div>
                  <strong>WhatsApp Florist</strong>
                  <div style={{ fontSize: '11px', color: 'var(--color-warning)' }}>
                    ⚠️ Nomor belum dikonfigurasi oleh pemilik toko.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formulir Kirim Pertanyaan Demo */}
        <div className="card card-body" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border)' }}>
            Kirim Pesan &amp; Pertanyaan
          </h2>

          {inquirySent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>💌</div>
              <h3 style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>
                Pesan Terkirim (Demo)!
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)' }}>
                Pesan simulasi Anda telah kami terima. Tim kami akan segera menanggapi.
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setInquirySent(false)}
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendInquiry} noValidate aria-label="Form Pertanyaan">
              <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
                <label className="form-label" htmlFor="inq-name">
                  Nama Anda <span className="required">*</span>
                </label>
                <input
                  id="inq-name"
                  type="text"
                  className="form-input"
                  placeholder="Nama Anda"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
                <label className="form-label" htmlFor="inq-contact">
                  Kontak (WhatsApp / Email)
                </label>
                <input
                  id="inq-contact"
                  type="text"
                  className="form-input"
                  placeholder="0812xxxx atau email@domain.com"
                  value={inquiryForm.contact}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, contact: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" htmlFor="inq-message">
                  Pesan / Pertanyaan <span className="required">*</span>
                </label>
                <textarea
                  id="inq-message"
                  rows={3}
                  className="form-input"
                  placeholder="Tuliskan pertanyaan atau kebutuhan buket custom Anda..."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                Kirim Pertanyaan
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FAQ Section ───────────────────────────────────── */}
      <div className="card card-body" style={{ padding: 'var(--space-8)' }} aria-label="Pertanyaan Umum">
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
          Pertanyaan Umum (FAQ)
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          Jawaban untuk hal-hal yang paling sering ditanyakan pelanggan kami.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    background: isOpen ? 'var(--color-pink-soft)' : 'var(--color-white)',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-pink-primary)' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: 'var(--space-4)',
                      background: 'var(--color-white)',
                      borderTop: '1px solid var(--color-border)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 'var(--line-height-relaxed)',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
        <Link to={ROUTES.CATALOG} className="btn btn-primary">
          🌸 Lihat Koleksi Buket Bunga Kami
        </Link>
      </div>
    </div>
  );
}
