const BASE_URL = 'http://localhost:3000/api'; // process.env.NEXT_PUBLIC_API_URL;

// Fonction utilitaire pour gérer les erreurs
const handleResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Une erreur est survenue');
	}
	return response.json();
};

export const artistApi = {
	// Récupération de tous les artistes avec pagination
	getAllArtists: async (page = 1, limit = 10) => {
		try {
			const response = await fetch(
				`${BASE_URL}/artists?page=${page}&limit=${limit}`
			);
			return handleResponse(response);
		} catch (error) {
			return {
				success: false,
				data: [],
				pagination: {totalItems: 0},
				error: error.message,
			};
		}
	},

	// Récupération de tous les albums avec pagination
	getAllAlbums: async (page = 1, limit = 10) => {
		try {
			const response = await fetch(
				`${BASE_URL}/albums?page=${page}&limit=${limit}`
			);
			return handleResponse(response);
		} catch (error) {
			return {albums: [], total: 0};
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

	createArtist: async (artistData) => {
		const response = await fetch(`${BASE_URL}/artists`, artistData);
		console.log(response.data);
		return response.data;
	},
};

// // Récupérer tous les utilisateurs
// export const getArtists = async () => {
//   const response = await fetch(`${BASE_URL}/artists`);
//   return response.data;
// };

// // Récupérer un utilisateur par son ID
// export const getArtistById = async (id) => {
//   const response = await fetch(`/artists/${id}`);
//   return response.data;
// };

// // Créer un nouvel utilisateur
// export const createArtist = async (artistData) => {
//   const response = await fetch(`/artists`, artistData);
//   console.log(response.data)
//   return response.data;
// };

// // Mettre à jour un utilisateur existant
// export const updateArtist = async (id, artistData) => {
//   const response = await fetch(`/artists/${id}`, artistData);
//   return response.data;
// };

// // Supprimer un utilisateur
// export const deleteArtist = async (id) => {
//   const response = await fetch(`/artists/${id}`);
//   return response.data;
// };
