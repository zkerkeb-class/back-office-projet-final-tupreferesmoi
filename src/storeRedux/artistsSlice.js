import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {artistApi} from '../app/api/artistAPI';

export const fetchArtists = createAsyncThunk(
	'artists/fetchArtists',
	async () => {
		const response = await artistApi.getAllArtists();
		return response;
	}
);

export const getArtist = createAsyncThunk(
	'artists/getArtist',
	async (artistId) => {
		const response = await artistApi.getArtist(artistId);
		return response;
	}
);

export const createArtist = createAsyncThunk(
	'artists/createArtist',
	async (artistData) => {
		const response = await artistApi.createArtist(artistData);
		return response;
	}
);

export const updateArtist = createAsyncThunk(
	'artists/updateArtist',
	async (artistData) => {
		const response = await artistApi.updateArtist(artistData);
		return response;
	}
);

export const deleteArtist = createAsyncThunk(
	'artists/deleteArtist',
	async (artistId) => {
		await artistApi.deleteArtist(artistId);
		return artistId;
	}
);

const artistSlice = createSlice({
	name: 'artists',
	initialState: {artists: [], artist: null, loading: false, error: null},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchArtists.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchArtists.fulfilled, (state, action) => {
				state.loading = false;
				state.artists = action.payload;
			})
			.addCase(fetchArtists.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(deleteArtist.fulfilled, (state, action) => {
				state.artists = state.artists.filter(
					(artist) => artist.id !== action.payload
				);
			});
	},
});

export const selectArtists = (state) => state.artists.artists;
export default artistSlice.reducer;
