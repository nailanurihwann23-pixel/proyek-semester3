/**
 * authContextDef.js — Definisi React Context untuk Auth
 * Dipisahkan agar file komponen tidak mengekspor non-komponen (Fast Refresh)
 */

import { createContext } from 'react';

export const AuthContext = createContext(null);
