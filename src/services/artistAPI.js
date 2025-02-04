const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'An error occured');
	}
	return response.json();
};

export const artistApi = {
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

	getArtist: async (artistId) => {
		const response = await fetch(`${BASE_URL}/artists/${artistId}`);
		return handleResponse(response);
	},

	getArtistTracks: async (artistId) => {
		const response = await fetch(`${BASE_URL}/artists/${artistId}/top-tracks`);
		return handleResponse(response);
	},

	getPopularArtists: async () => {
		const response = await fetch(`${BASE_URL}/artists/popular`);
		return handleResponse(response);
	},

	createArtist: async (artistData) => {
		try {
			const response = await fetch('/artists', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(artistData),
			});

			return handleResponse(response);
		} catch (error) {
			throw new Error(error.message || "Error : Can't create artist");
		}
	},

	updateArtist: async (artistData) => {
		try {
			const response = await fetch(`/artists/${artistData.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(artistData),
			});

			return handleResponse(response);
		} catch (error) {
			throw new Error(error.message || "Error : Can't update artist");
		}
	},

	deleteArtist: async (artistId) => {
		try {
			const response = await fetch(`/artists/${artistId}`, {
				method: 'DELETE',
			});

			return handleResponse(response);
		} catch (error) {
			throw new Error(error.message || "Error : Can't delete artist");
		}
	},
};
