// This file replaces the direct Supabase connection.
// All requests should now go to the backend API.

const API_URL = 'http://localhost:4000'; // Update this with your actual backend URL

export const api = {
    checkHealth: async () => {
        try {
            const response = await fetch(`${API_URL}/`);
            return await response.text();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Recordatorios
    getRecordatorios: async () => {
        const response = await fetch(`${API_URL}/recordatorios`);
        if (!response.ok) throw new Error('Error fetching recordatorios');
        return await response.json();
    },

    createRecordatorio: async (data) => {
        const response = await fetch(`${API_URL}/recordatorios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error creating recordatorio');
        return await response.json();
    },

    deleteRecordatorio: async (id) => {
        const response = await fetch(`${API_URL}/recordatorios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting recordatorio');
        return true;
    },

    // Finales
    getFinales: async () => {
        const response = await fetch(`${API_URL}/finales`);
        if (!response.ok) throw new Error('Error fetching finales');
        return await response.json();
    },

    createFinal: async (data) => {
        const response = await fetch(`${API_URL}/finales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error creating final');
        return await response.json();
    },

    deleteFinal: async (id) => {
        const response = await fetch(`${API_URL}/finales/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting final');
        return true;
    }
};
