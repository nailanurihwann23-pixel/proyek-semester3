/**
 * ProductFormPage.jsx — Form tambah / edit produk admin
 * Sistem Informasi Buket Bunga
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.jsx';
import {
  getProductById,
  createProduct,
  updateProduct,
  getCategories,
} from '../../services/mockService.js';
import { required, validatePrice, validateStock, runValidations } from '../../utils/validation.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load categories and initial product data if editing
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        setLoading(true);
        setLoadError(null);
        const categoryList = await getCategories();
        if (isMounted) setCategories(categoryList);

        if (isEditMode) {
          const product = await getProductById(productId);
          if (isMounted) {
            setFormData({
              name: product.name || '',
              category: product.category || '',
              price: String(product.price || ''),
              stock: String(product.stock ?? ''),
              description: product.description || '',
              image: product.image || null,
            });
            if (product.image) {
              setPhotoPreview(product.image);
            }
          }
        }
      } catch (err) {
        if (isMounted) setLoadError(err.message || 'Gagal memuat data produk.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [productId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error field jika ada perubahan
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Simulasi upload file gambar
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Format file tidak didukung. Harap pilih file gambar (JPG, PNG, WebP).',
      }));
      return;
    }

    // Buat URL preview sementara
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setFormData((prev) => ({ ...prev, image: previewUrl }));
    setErrors((prev) => ({ ...prev, image: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    const validationErrors = runValidations({
      name: () => required(formData.name),
      price: () => validatePrice(formData.price),
      stock: () => validateStock(formData.stock),
      description: () => required(formData.description),
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim() || 'Umum',
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        image: formData.image || null,
      };

      if (isEditMode) {
        await updateProduct(productId, payload);
        setFeedback({
          type: 'success',
          text: 'Perubahan produk berhasil disimpan!',
        });
      } else {
        await createProduct(payload);
        setFeedback({
          type: 'success',
          text: 'Produk baru berhasil ditambahkan ke katalog!',
        });
      }

      // Redirect setelah jeda singkat
      setTimeout(() => {
        navigate(ROUTES.ADMIN_PRODUCTS);
      }, 900);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Gagal menyimpan produk.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner label="Memuat formulir produk..." />
      </div>
    );
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-primary)' }}>
            {isEditMode ? 'Edit Produk Buket' : 'Tambah Produk Buket Baru'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '2px' }}>
            {isEditMode
              ? `Perbarui informasi atau stok untuk produk ${formData.name || ''}`
              : 'Isi informasi lengkap untuk mempublikasikan buket bunga ke katalog.'}
          </p>
        </div>
        <Link to={ROUTES.ADMIN_PRODUCTS} className="btn btn-secondary btn-sm">
          ← Kembali ke Daftar
        </Link>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: feedback.type === 'success' ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
            color: feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
            border: `1px solid ${feedback.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
          }}
        >
          {feedback.text}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Field: Nama Produk */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nama Produk Buket <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Contoh: Buket Mawar Merah Romantis"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="form-error">⚠️ {errors.name}</span>}
        </div>

        {/* Row: Kategori & Harga */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {/* Field: Kategori */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Kategori
            </label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                id="category"
                name="category"
                type="text"
                list="category-suggestions"
                className="form-input"
                placeholder="Pilih atau ketik kategori baru"
                value={formData.category}
                onChange={handleChange}
              />
              <datalist id="category-suggestions">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              Contoh: Mawar, Tulip, Baby Breath, Mix
            </span>
          </div>

          {/* Field: Harga */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Harga Satuan (IDR) <span className="required">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1000"
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="Contoh: 185000"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="form-error">⚠️ {errors.price}</span>}
          </div>
        </div>

        {/* Field: Stok Awal */}
        <div className="form-group">
          <label htmlFor="stock" className="form-label">
            Jumlah Stok <span className="required">*</span>
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            className={`form-input ${errors.stock ? 'error' : ''}`}
            placeholder="Contoh: 15 (isi 0 jika stok kosong)"
            value={formData.stock}
            onChange={handleChange}
            style={{ maxWidth: '240px' }}
          />
          {errors.stock && <span className="form-error">⚠️ {errors.stock}</span>}
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Produk dengan stok 0 otomatis diberi status Habis dan pelanggan tidak dapat memesannya.
          </span>
        </div>

        {/* Field: Deskripsi */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Deskripsi Produk <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`form-input ${errors.description ? 'error' : ''}`}
            placeholder="Jelaskan jenis bunga, nuansa warna, kemasan pita/kertas, dan rekomendasi acara..."
            value={formData.description}
            onChange={handleChange}
            style={{ resize: 'vertical' }}
          />
          {errors.description && <span className="form-error">⚠️ {errors.description}</span>}
        </div>

        {/* Field: Unggah Foto (Simulasi Preview) */}
        <div className="form-group">
          <label className="form-label">Foto / Gambar Produk</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              padding: 'var(--space-4)',
              border: '1.5px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
            }}
          >
            {/* Box Preview */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-pink-soft) 0%, var(--color-yellow-soft) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview buket"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '2rem' }}>🌸</span>
              )}
            </div>

            {/* Input & Helper */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                style={{ fontSize: 'var(--font-size-xs)' }}
              />
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                Format didukung: JPG, PNG, WebP. Maksimal ukuran demo 5MB.
              </p>
              {errors.image && <span className="form-error">⚠️ {errors.image}</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Link to={ROUTES.ADMIN_PRODUCTS} className="btn btn-secondary">
            Batal
          </Link>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>
        </div>
      </form>
    </div>
  );
}
