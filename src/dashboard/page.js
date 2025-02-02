import React from 'react';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
	DashboardContainer,
	Card,
	Curve,
	KPI,
	MetricsContainer,
	DashboardTop,
} from './style';
import {useSelector, useDispatch} from 'react-redux';
import {
	selectStats,
	selectKpiConfig,
	responseTimes,
	cacheLatencies,
	updateKpiConfig,
} from '../storeRedux/dashboardSlice';
import {Line} from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import {getkpiConfig, saveKpiConfig} from '../utils/cookies';
import KpiChart from './KpiChart';

// Save necessary Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

export function getKpiData(kpiId, stats) {
	const kpiKeyMap = {
		cpuUsage: stats.cpuUsage,
		memoryUsage: stats.memoryUsage,
		diskUsage: stats.diskUsage,
		bandwithUsage: stats.bandwithUsage,
		streams: stats.streamNumber,
		users: stats.activeUsersNumber,
		usedStorage: stats.usedStorage,
		mediaTreatmentTime: stats.mediaTreatmentTime,
		successRate: stats.successRate,
	};

	const statkey = kpiKeyMap[kpiId];
	if (!statkey) {
		console.error(`No mapping found for KPI: ${kpiId}`);
		return {datasets: [{data: [0]}]};
	}

	const value = stats[kpiId] || 0;

	console.log(`KPI: ${kpiId} - statkey: ${statkey} - value: ${value}`);

	const templates = {
		cpuUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [value, 100 - value],
					backgroundColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
				},
			],
		},
		memoryUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [value, 100 - value],
					backgroundColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
				},
			],
		},
		diskUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [value, 100 - value],
					backgroundColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
				},
			],
		},
		bandwithUsage: {
			datasets: [
				{
					data: [value],
				},
			],
		},
		streams: {
			datasets: [
				{
					data: [value],
				},
			],
		},
		users: {
			datasets: [
				{
					data: [value],
				},
			],
		},
		usedStorage: {
			datasets: [
				{
					data: [value, stats.totalStorage || 0],
					backgroundColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
				},
			],
		},
		mediaTreatmentTime: {
			datasets: [
				{
					data: [value],
				},
			],
		},
		successRate: {
			labels: ['Success', 'Failure'],
			datasets: [
				{
					data: [value, 100 - value],
					backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
					borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
				},
			],
		},
	};

	return templates[kpiId] || {datasets: [{data: [0]}]};
}

export function getLineData() {
	return {
		labels: ['Request 1', 'Request 2', 'Request 3', 'Request 4', 'Request 5'], // Labels for X axis
		datasets: [
			{
				label: 'Time response of API requests (ms)',
				data: responseTimes,
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.1,
			},
			{
				label: 'Redis cache latency (ms)',
				data: cacheLatencies,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				tension: 0.1,
			},
		],
	};
}

export default function Dashboard() {
	const dispatch = useDispatch();
	const stats = useSelector(selectStats);
	const kpiConfig = useSelector(selectKpiConfig);
	const [initialized, setInitialized] = useState(false);

	const linedata = getLineData();

	useEffect(() => {
		const savedKpiConfig = getkpiConfig();

		if (!savedKpiConfig) {
			saveKpiConfig(kpiConfig);
		} else {
			dispatch(updateKpiConfig(savedKpiConfig));
		}

		setInitialized(true);
	}, [dispatch, kpiConfig]);

	if (!initialized) {
		return <p>Loading...</p>;
	}

	return (
		<DashboardContainer>
			<DashboardTop>
				<h1>Dashboard</h1>
				<Link to="/config">⚙️ Configure KPIs</Link>
			</DashboardTop>
			<Card>
				<h2>System performance metrics</h2>
				<Curve>
					<h3>Time response of API requests and Redis cache latency</h3>
					<Line data={linedata} />
				</Curve>

				<h3>Server ressource usage and business metrics</h3>
				<MetricsContainer>
					{Object.values(kpiConfig)
						.filter((kpi) => kpi.enabled)
						.sort((a, b) => a.order - b.order)
						.map((kpi) => {
							const data = getKpiData(kpi.id, stats);
							return (
								<div key={kpi.id} className="metric-item">
									<p>{kpi.label} :</p>
									<KPI>
										<KpiChart kpi={kpi} data={data} />
									</KPI>
								</div>
							);
						})}
				</MetricsContainer>
			</Card>
		</DashboardContainer>
	);
}
