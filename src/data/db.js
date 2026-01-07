// src/data/db.js

// Estado inicial con horarios precargados para testear
let MATERIAS_DB = [
  // NIVEL 1
  { id: 1, nombre: "Análisis Mat. I", nivel: 1, estado: "aprobada", dia: 'LU', hora: 18, duracion: 4, aula: '301' },
  { id: 2, nombre: "Álgebra y Geom.", nivel: 1, estado: "aprobada", dia: 'MA', hora: 14, duracion: 4, aula: '302' },
  { id: 3, nombre: "Física I", nivel: 1, estado: "aprobada", dia: 'MI', hora: 8, duracion: 4, aula: 'Lab B' },

  // NIVEL 2 (Las que estás cursando ahora)
  { id: 9, nombre: "Análisis Mat. II", nivel: 2, estado: "cursando", dia: 'LU', hora: 18, duracion: 3, aula: 'Aula 404' },
  { id: 10, nombre: "Física II", nivel: 2, estado: "cursando", dia: 'MI', hora: 19, duracion: 3, aula: 'Lab Física' },
  { id: 14, nombre: "Análisis Sist.", nivel: 2, estado: "cursando", dia: 'JU', hora: 18, duracion: 4, aula: 'Aula 205' },
  { id: 4, nombre: "Algoritmos y ED", nivel: 1, estado: "regularizada", dia: 'VI', hora: 14, duracion: 4, aula: 'Lab 1' },
];

// Importar servicio de API (solo si existe)
let apiService = null;
try {
  apiService = require('../services/api').api;
  console.log('✅ API service loaded successfully');
} catch (e) {
  console.log('❌ API service not available, using local data only:', e.message);
}

// Función para obtener todas (intenta API primero, fallback a datos locales)
export const getMaterias = async () => {
  if (apiService) {
    try {
      // Intentar obtener datos de la API
      const response = await apiService.getMaterias();
      if (response && Array.isArray(response)) {
        console.log('✅ Datos obtenidos desde API');
        return response;
      }
    } catch (error) {
      console.log('⚠️ API no disponible, usando datos locales:', error.message);
    }
  }

  // Fallback a datos locales
  return MATERIAS_DB;
};

// Función para actualizar una materia (Cambiar horario)
export const updateMateria = async (id, nuevosDatos) => {
  if (apiService) {
    try {
      // Intentar actualizar en la API
      await apiService.updateMateria(id, nuevosDatos);
      console.log('✅ Materia actualizada en API');
      return true;
    } catch (error) {
      console.log('⚠️ API no disponible, actualizando localmente:', error.message);
    }
  }

  // Fallback a actualización local
  const index = MATERIAS_DB.findIndex(m => m.id === Number(id));
  if (index !== -1) {
    MATERIAS_DB[index] = { ...MATERIAS_DB[index], ...nuevosDatos };
    return true;
  }
  return false;
};

// Función para buscar por ID
export const getMateriaById = async (id) => {
  if (apiService) {
    try {
      // Intentar obtener de la API
      const response = await apiService.getMateriaById(id);
      if (response) {
        console.log('✅ Materia obtenida desde API');
        return response;
      }
    } catch (error) {
      console.log('⚠️ API no disponible, buscando localmente:', error.message);
    }
  }

  // Fallback a búsqueda local
  return MATERIAS_DB.find(m => m.id === Number(id));
};
