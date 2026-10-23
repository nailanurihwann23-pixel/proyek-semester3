/**
 * useAuth.js — Custom hook untuk mengakses sesi auth
 * Sistem Informasi Buket Bunga
 */

import { useContext } from 'react';
import { AuthContext } from './authContextDef.js';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}
