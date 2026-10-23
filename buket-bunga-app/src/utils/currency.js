/**
 * currency.js — Utilitas format mata uang Rupiah (IDR)
 *
 * Sistem Informasi Buket Bunga
 */

/**
 * Format angka ke string Rupiah.
 * @param {number} amount - Jumlah dalam angka
 * @param {boolean} [withSymbol=true] - Sertakan simbol "Rp"
 * @returns {string} Contoh: "Rp 185.000"
 */
export function formatRupiah(amount, withSymbol = true) {
  if (typeof amount !== 'number' || isNaN(amount)) return withSymbol ? 'Rp –' : '–';

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return withSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Parse string Rupiah kembali ke angka.
 * @param {string} value - Contoh: "Rp 185.000" atau "185000"
 * @returns {number}
 */
export function parseRupiah(value) {
  if (typeof value === 'number') return value;
  return Number(String(value).replace(/[^\d]/g, '')) || 0;
}
