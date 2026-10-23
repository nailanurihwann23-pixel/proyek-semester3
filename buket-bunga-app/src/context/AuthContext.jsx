/**
 * AuthContext.jsx — Provider autentikasi admin (demo)
 *
 * ⚠️  DEMO ONLY — Bukan keamanan produksi.
 * State login disimpan di sessionStorage (habis saat tab ditutup).
 * Ganti dengan autentikasi backend nyata sebelum produksi.
 */

import { useState } from 'react';
import { AuthContext } from './authContextDef.js';
import { loginAdmin, logoutAdmin } from '../services/mockService.js';

function getInitialUser() {
  try {
    const saved = sessionStorage.getItem('buket_demo_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  async function login(username, password) {
    setLoading(true);
    try {
      const result = await loginAdmin(username, password);
      setUser(result.user);
      sessionStorage.setItem('buket_demo_user', JSON.stringify(result.user));
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await logoutAdmin();
      setUser(null);
      sessionStorage.removeItem('buket_demo_user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
