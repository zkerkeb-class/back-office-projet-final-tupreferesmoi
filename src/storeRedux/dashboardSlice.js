import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stats: {
        totalUsers: 1500,
        totalSongs: 5000,
        totalPlaylists: 300,
    },
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
});

export const selectStats = (state) => state.dashboard.stats;
export default dashboardSlice.reducer;
