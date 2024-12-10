import React from "react";
import { DashboardContainer, Card } from "./style";
import { useSelector } from "react-redux";
import { selectStats } from "../storeRedux/dashboardSlice";

export default function Dashboard() {
    const stats = useSelector(selectStats);

    return (
        <DashboardContainer>
            <h1>Dashboard</h1>
            <Card>
                <h2>Total Users</h2>
                <p>{stats.totalUsers}</p>
            </Card>
            <Card>
                <h2>Total Songs</h2>
                <p>{stats.totalSongs}</p>
            </Card>
            <Card>
                <h2>Total Playlists</h2>
                <p>{stats.totalPlaylists}</p>
            </Card>
        </DashboardContainer>
    );
}
