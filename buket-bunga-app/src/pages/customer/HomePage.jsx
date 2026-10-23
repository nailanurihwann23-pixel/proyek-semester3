/**
 * HomePage.jsx — Halaman Beranda Pelanggan
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import { getProducts } from '../../services/mockService.js';
import ProductCard from '../../components/customer/ProductCard.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const allProducts = await getProducts();
        if (isMounted) {
          // Ambil produk unggulan (maks 4 produk dengan stok terbanyak)
          const featured = [...allProducts]
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 4);
          setFeaturedProducts(featured);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Gagal memuat produk unggulan.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero Section ───────────────────────────────────── */}
      <section
        className="home-hero"
        style={{
          background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
          padding: 'var(--space-20) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Hero Toko Buket Bunga"
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-pink-primary)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <span>🌸</span> Koleksi Buket Bunga Segar &amp; Elegan
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              marginBottom: 'var(--space-4)',
            }}
          >
            Sampaikan Kasih &amp; Doa Melalui<br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-pink-primary), var(--color-pink-dark))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Rangkaian Bunga Terbaik
            </span>
          </h1>

          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto var(--space-8)',
              lineHeight: 'var(--line-height-relaxed)',
            }}
          >
            Pilihan tepat untuk perayaan wisuda, ulang tahun, anniversary, hingga
            ungkapan terima kasih. Dirangkai rapi dengan penuh kehangatan.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.CATALOG} className="btn btn-primary btn-lg" id="hero-btn-catalog">
              🌺 Jelajahi Katalog
            </Link>
            <Link to={ROUTES.ORDER_FORM} className="btn btn-secondary btn-lg" id="hero-btn-order">
              📝 Buat Pesanan Baru
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section Produk Unggulan ───────────────────────── */}
      <section className="container" style={{ padding: 'var(--space-16) var(--space-4)' }} aria-label="Produk Unggulan">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Paling Populer
            </span>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)' }}>
              Produk Unggulan
            </h2>
          </div>
          <Link to={ROUTES.CATALOG} className="btn btn-ghost btn-sm">
            Lihat Semua Produk →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Memuat produk unggulan..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Section Keunggulan Toko ───────────────────────── */}
      <section
        style={{
          background: 'var(--color-bg)',
          padding: 'var(--space-16) 0',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
        aria-label="Keunggulan Layanan"
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-12)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Kenapa Memilih Kami
            </span>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
              Dedikasi di Setiap Tangkai Bunga
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Kami memastikan setiap buket dirangkai dengan standar mutu tinggi dan bunga segar pilihan.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {[
              {
                icon: '🌿',
                title: 'Bunga Segar Terjamin',
                desc: 'Dipetik dan dirawat setiap pagi agar tetap segar dan tahan lama di tangan penerima.',
              },
              {
                icon: '🎨',
                title: 'Desain Elegan & Personal',
                desc: 'Kombinasi warna artistik oleh perangkai bunga berpengalaman untuk kesan mendalam.',
              },
              {
                icon: '💌',
                title: 'Gratis Kartu Ucapan',
                desc: 'Tulis pesan personal Anda, kami cetak rapi dengan kartu ucapan bernuansa eksklusif.',
              },
              {
                icon: '🚚',
                title: 'Pengiriman Terjadwal',
                desc: 'Tentukan tanggal pengiriman sesuai rencana kejutan atau jadwal acara Anda.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card card-body"
                style={{ textAlign: 'center', padding: 'var(--space-6) var(--space-5)' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section Tentang Toko ─────────────────────────── */}
      <section className="container" style={{ padding: 'var(--space-16) var(--space-4)' }} aria-label="Tentang Kami">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-10)',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-12)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '280px',
            }}
          >
            <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }} aria-hidden="true">🌸</div>
            <div style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)', color: 'var(--color-pink-dark)' }}>
              [Nama Toko]
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Florist &amp; Bouquet Specialist
            </div>
          </div>

          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Cerita Kami
            </span>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
              Merangkai Kebahagiaan untuk Hari Istimewa Anda
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)' }}>
              [Nama Toko] berdedikasi menghadirkan karya buket bunga yang tidak hanya indah secara visual, namun juga mampu mewakili kehangatan rasa sayang dan penghargaan Anda kepada orang-orang terkasih.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
              Kami menyediakan aneka pilihan bunga impor dan lokal mulai dari mawar premium, tulip pastel, matahari cerah, hingga peony mewah yang siap dikirimkan tepat pada waktunya.
            </p>
            <Link to={ROUTES.CONTACT} className="btn btn-secondary">
              Hubungi Kami untuk Tanya-Jawab →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section CTA Banner ────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-pink-primary), var(--color-pink-dark))',
          padding: 'var(--space-16) 0',
          color: 'var(--color-white)',
          textAlign: 'center',
        }}
        aria-label="Aksi Cepat"
      >
        <div className="container">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-white)', marginBottom: 'var(--space-3)' }}>
            Siap Membuat Momen Spesial Hari Ini?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '480px', margin: '0 auto var(--space-8)', fontSize: 'var(--font-size-sm)' }}>
            Pesan sekarang secara online atau cek status pesanan yang telah Anda buat sebelumnya.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={ROUTES.ORDER_FORM}
              className="btn btn-secondary btn-lg"
              style={{ background: 'var(--color-white)', color: 'var(--color-pink-dark)' }}
            >
              Mulai Pesan Sekarang
            </Link>
            <Link
              to={ROUTES.ORDER_STATUS}
              className="btn btn-ghost btn-lg"
              style={{ color: 'var(--color-white)', borderColor: 'rgba(255, 255, 255, 0.4)' }}
            >
              Cek Status Pesanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
