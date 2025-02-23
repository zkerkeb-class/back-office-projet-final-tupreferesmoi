import {configureStore} from '@reduxjs/toolkit';
import dashboardReducer from './storeRedux/dashboardSlice';
import artistReducer from './storeRedux/artistsSlice';

const store = configureStore({
	reducer: {
		dashboard: dashboardReducer,
		artists: artistReducer,
	},
});

export default store;
