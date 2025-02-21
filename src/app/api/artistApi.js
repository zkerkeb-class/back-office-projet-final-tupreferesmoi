const BASE_URL = 'http://localhost:3000/api'; // process.env.NEXT_PUBLIC_API_URL;

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
	const token = localStorage.getItem('token');
	const headers = {
		'Content-Type': 'application/json',
		...(token && {Authorization: `Bearer ${token}`}),
		...options.headers,
	};

	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers,
	});

	return handleResponse(response);
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

	// Récupération d'un artiste
	getArtist: async (artistId) => {
		const response = await fetch(`${BASE_URL}/artists/${artistId}`);
		return handleResponse(response);
	},

	createArtist: async (artistData) => {
		debugger;
		const response = await fetchWithAuth('/artists', {
			method: 'POST',
			body: artistData,
		});
		console.log(response.data);
		return response.data;
	},

	// Mettre à jour un utilisateur existant
	updateArtist: async (id, artistData) => {
		const response = await fetchWithAuth(`/artists/${id}`, {
			method: 'PUT',
			body: artistData,
		});
		return response.data;
	},

	// Supprimer un utilisateur
	deleteArtist: async (id) => {
		const response = await fetchWithAuth(`/artists/${id}`, {
			method: 'DELETE',
		});
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

// Supprimer un utilisateur
export const deleteArtist = async (id) => {
	const response = await fetch(`/artists/${id}`);
	return response.data;
};
