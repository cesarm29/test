import axios from 'axios';
import { Albaran } from '../interfaces/Albaran';

const API_URL = 'https://develop.noproblemcooking.com:8443/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Autenticación (Login)
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.access_token;
};

// Obtener Productos con paginación
export const getProductos = async (token: string, page: number = 1, itemsPerPage: number = 20) => {
  const response = await api.get('/articulos', {
    params: {
      activo: 1,
      is_materia_prima: false,
      page: page,
      per_page: itemsPerPage,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Obtener Ivas
export const getIvas = async (token: string) => {
  const response = await api.get('/ivasettings/ventas', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Registrar Albarán
export const registrarAlbaran = async (data: Albaran, token: string) => {
  const response = await api.post('/albaranventa', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
