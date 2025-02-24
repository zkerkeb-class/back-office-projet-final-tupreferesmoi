'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
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
} from '@/storeRedux/dashboardSlice';
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
import {getkpiConfig, saveKpiConfig} from '@/utils/cookies';
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

export function getKpiData(kpi, stats) {
	if (!kpi || !stats) {
		console.error('Invalid KPI or stats object');
		return {datasets: [{data: [0]}]};
	}

	const statKeyMap = {
		1: 'cpuUsage',
		2: 'memoryUsage',
		3: 'diskUsage',
		4: 'bandwithUsage',
		5: 'streamNumber',
		6: 'activeUsersNumber',
		7: 'usedStorage',
		8: 'mediaTreatmentTime',
		9: 'successRate',
	};

	const statKey = statKeyMap[kpi.id];

	if (!statKey || stats[statKey] === undefined) {
		console.error(`No mapping found for KPI: ${kpi.id}`);
		return {datasets: [{data: [0]}]};
	}

	const templates = {
		cpuUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [stats.cpuUsage, 100 - stats.cpuUsage],
					backgroundColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
				},
			],
		},
		memoryUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [stats.memoryUsage, 100 - stats.memoryUsage],
					backgroundColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
				},
			],
		},
		diskUsage: {
			labels: ['Usage', 'Free'],
			datasets: [
				{
					data: [stats.diskUsage, 100 - stats.diskUsage],
					backgroundColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
				},
			],
		},
		bandwithUsage: {
			datasets: [
				{
					data: [stats.bandwithUsage],
				},
			],
		},
		streams: {
			datasets: [
				{
					data: [stats.streamNumber],
				},
			],
		},
		users: {
			datasets: [
				{
					data: [stats.activeUsersNumber],
				},
			],
		},
		usedStorage: {
			datasets: [
				{
					data: [stats.usedStorage, stats.totalStorage || 0],
					backgroundColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
					borderColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
				},
			],
		},
		mediaTreatmentTime: {
			datasets: [
				{
					data: [stats.mediaTreatmentTime],
				},
			],
		},
		successRate: {
			labels: ['Success', 'Failure'],
			datasets: [
				{
					data: [stats.successRate, 100 - stats.successRate],
					backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
					borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
				},
			],
		},
	};

	return templates[statKey] || {datasets: [{data: [0]}]};
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
		if (typeof window !== 'undefined') {
			const savedKpiConfig = getkpiConfig();

			if (!savedKpiConfig) {
				saveKpiConfig(kpiConfig);
			} else {
				dispatch(updateKpiConfig(savedKpiConfig));
			}

			setInitialized(true);
		}
	}, [dispatch, kpiConfig]);

	if (!initialized) {
		return <p>Loading...</p>;
	}

	return (
		<DashboardContainer>
			<DashboardTop>
				<h1>Dashboard</h1>
				<Link href="/config">⚙️ Configure KPIs</Link>
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
							const data = getKpiData(kpi, stats);
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
