/**
 * validation.js — Utilitas validasi form
 *
 * Sistem Informasi Buket Bunga
 * Pesan validasi dalam Bahasa Indonesia.
 */

/**
 * Cek apakah nilai tidak kosong (setelah trim).
 * @param {string} value
 * @returns {string|null} pesan error atau null jika valid
 */
export function required(value) {
  if (!value || String(value).trim() === '') {
    return 'Field ini wajib diisi.';
  }
  return null;
}

/**
 * Validasi nomor telepon Indonesia (minimal 9 digit, angka saja).
 * @param {string} value
 * @returns {string|null}
 */
export function validatePhone(value) {
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return 'Nomor telepon wajib diisi.';
  if (digits.length < 9 || digits.length > 15) {
    return 'Nomor telepon harus terdiri dari 9–15 angka.';
  }
  return null;
}

/**
 * Validasi harga: harus angka positif.
 * @param {number|string} value
 * @returns {string|null}
 */
export function validatePrice(value) {
  const num = Number(value);
  if (isNaN(num) || num < 0) return 'Harga tidak boleh negatif.';
  if (num === 0) return 'Harga harus lebih dari nol.';
  return null;
}

/**
 * Validasi stok: harus bilangan bulat non-negatif.
 * @param {number|string} value
 * @returns {string|null}
 */
export function validateStock(value) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 0) {
    return 'Stok harus bilangan bulat (0 atau lebih).';
  }
  return null;
}

/**
 * Validasi kuantitas pesanan: minimal 1, tidak melebihi stok.
 * @param {number|string} quantity
 * @param {number} maxStock
 * @returns {string|null}
 */
export function validateQuantity(quantity, maxStock) {
  const num = Number(quantity);
  if (!Number.isInteger(num) || num < 1) return 'Jumlah minimal 1.';
  if (maxStock !== undefined && num > maxStock) {
    return `Jumlah tidak boleh melebihi stok tersedia (${maxStock}).`;
  }
  return null;
}

/**
 * Jalankan kumpulan validasi dan kembalikan objek error.
 * @param {Record<string, () => string|null>} rules - key: nama field, value: fungsi validasi
 * @returns {Record<string, string>} objek { fieldName: pesanError }
 */
export function runValidations(rules) {
  const errors = {};
  for (const [field, validate] of Object.entries(rules)) {
    const error = validate();
    if (error) errors[field] = error;
  }
  return errors;
}
