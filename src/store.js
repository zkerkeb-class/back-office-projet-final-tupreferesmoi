import {configureStore} from '@reduxjs/toolkit';
import dashboardReducer from './storeRedux/dashboardSlice'; // Chemin vers ton slice

const store = configureStore({
	reducer: {
		dashboard: dashboardReducer, // Connecte le slice au store
	},
});

export default store;
