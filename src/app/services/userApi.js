const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
};

// Fonction utilitaire pour les requêtes avec authentification
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
};

export const userApi = {

    // Récupération de tous les artistes avec pagination
    getAllUsers: async () => {
        try {
            const response = await fetch(`${BASE_URL}/users/`);
            return handleResponse(response);
        } catch (error) {
            return {
                success: false,
                data: [],
                error: error.message,
            };
        }
    },

    // Récupération de tous les albums avec pagination
    getAllAlbums: async (page = 1, limit = 10) => {
        try {
            const response = await fetch(`${BASE_URL}/albums?page=${page}&limit=${limit}`);
            return handleResponse(response);
        } catch (error) {
            return { albums: [], total: 0 };
        }
    },

    // Récupération d'une piste spécifique
    getTrack: async (trackId) => {
        const response = await fetch(`${BASE_URL}/tracks/${trackId}`);
        return handleResponse(response);
    },

    // Récupération d'un artiste
    getArtist: async (artistId) => {
        const response = await fetch(`${BASE_URL}/artists/${artistId}`);
        return handleResponse(response);
    },

    // Récupération des pistes d'un artiste
    getArtistTracks: async (artistId) => {
        const response = await fetch(`${BASE_URL}/artists/${artistId}/top-tracks`);
        return handleResponse(response);
    },

    // Récupération d'un album spécifique
    getAlbum: async (albumId) => {
        const response = await fetch(`${BASE_URL}/albums/${albumId}`);
        return handleResponse(response);
    },

    // Récupération des pistes d'un album
    getAlbumTracks: async (albumId) => {
        const response = await fetch(`${BASE_URL}/albums/${albumId}/tracks`);
        return handleResponse(response);
    },

    // Récupération des morceaux récents (pour la home)
    getRecentTracks: async () => {
        const response = await fetch(`${BASE_URL}/tracks/recent`);
        return handleResponse(response);
    },




};
