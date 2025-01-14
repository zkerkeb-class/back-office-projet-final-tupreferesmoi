import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	stats: {
		apiTimeResponse: 200,
		cpuUsage: 40,
		memoryUsage: 40,
		diskUsage: 40,
		redisCacheLatency: 50,
		bandwithUsage: 10,
		streamNumber: 100,
		activeUsersNumber: 1000,
		usedStorage: 20.3,
		successRate: 75,
		mediaTreatmentTime: 100,
	},
};

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {},
});

export const selectStats = (state) => state.dashboard.stats;
export default dashboardSlice.reducer;
export const responseTimes = [200, 300, 400, 350, 250];
export const cacheLatencies = [50, 40, 30, 20, 25];
