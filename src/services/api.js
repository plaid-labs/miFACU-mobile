// API Service para conectar con el backend
// Para desarrollo móvil, usar IP de la máquina host en lugar de localhost
const API_BASE_URL = __DEV__ ? 'http://192.168.0.20:4000' : 'https://your-production-api.com';

export const api = {
  // === MATERIAS ===
  async getMaterias() {
    try {
      const response = await fetch(`${API_BASE_URL}/materias`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al obtener materias');
    } catch (error) {
      console.error('Error en getMaterias:', error);
      // Fallback a datos locales si falla la API
      try {
        const { getMaterias } = require('../data/db');
        return getMaterias();
      } catch (fallbackError) {
        console.error('Error en fallback de getMaterias:', fallbackError);
        return [];
      }
    }
  },

  async getMateriaById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/materias/${id}`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al obtener materia');
    } catch (error) {
      console.error('Error en getMateriaById:', error);
      // Fallback a datos locales
      try {
        const { getMateriaById } = require('../data/db');
        return getMateriaById(id);
      } catch (fallbackError) {
        console.error('Error en fallback de getMateriaById:', fallbackError);
        return null;
      }
    }
  },

  async updateMateria(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/materias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al actualizar materia');
    } catch (error) {
      console.error('Error en updateMateria:', error);
      // Fallback a datos locales
      try {
        const { updateMateria } = require('../data/db');
        return updateMateria(id, data);
      } catch (fallbackError) {
        console.error('Error en fallback de updateMateria:', fallbackError);
        return false;
      }
    }
  },

  // === RECORDATORIOS (PARCIALES) ===
  async getRecordatorios() {
    try {
      const response = await fetch(`${API_BASE_URL}/recordatorios`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al obtener recordatorios');
    } catch (error) {
      console.error('Error en getRecordatorios:', error);
      return []; // Retornar array vacío si falla
    }
  },

  async createRecordatorio(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/recordatorios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al crear recordatorio');
    } catch (error) {
      console.error('Error en createRecordatorio:', error);
      throw error;
    }
  },

  async deleteRecordatorio(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/recordatorios/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al eliminar recordatorio');
    } catch (error) {
      console.error('Error en deleteRecordatorio:', error);
      throw error;
    }
  },

  // === FINALES ===
  async getFinales() {
    try {
      const response = await fetch(`${API_BASE_URL}/finales`);
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al obtener finales');
    } catch (error) {
      console.error('Error en getFinales:', error);
      return []; // Retornar array vacío si falla
    }
  },

  async createFinal(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/finales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al crear final');
    } catch (error) {
      console.error('Error en createFinal:', error);
      throw error;
    }
  },

  async deleteFinal(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/finales/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      throw new Error(result.message || 'Error al eliminar final');
    } catch (error) {
      console.error('Error en deleteFinal:', error);
      throw error;
    }
  },
};
