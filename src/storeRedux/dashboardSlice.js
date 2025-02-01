import {createSlice} from '@reduxjs/toolkit';
import {initializeKpiConfig} from '../utils/cookies';

const initialState = () => {
	const kpiConfig = initializeKpiConfig();
	return {
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
		kpiConfig,
	};
};

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: {
		updateKpiConfig: (state, action) => {
			const {id, key, value} = action.payload;

			// If KPI exists, update the specific key
			if (state.kpiConfig[id]) {
				state.kpiConfig[id] = {
					...state.kpiConfig[id],
					[key]: value,
				};
			}
		},

		// Replace the configuration of every KPI if necessary
		replaceKpiConfig: (state, action) => {
			state.kpiConfig = action.payload;
		},
	},
});

export const selectStats = (state) => state.dashboard.stats;
export const selectKpiConfig = (state) => state.dashboard.kpiConfig;

export const {updateKpiConfig, replaceKpiConfig} = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const responseTimes = [200, 300, 400, 350, 250];
export const cacheLatencies = [50, 40, 30, 20, 25];
