import React from 'react';
import {
	DashboardContainer,
	Card,
	Curve,
	Circle,
	MetricsContainer,
} from './style';
import {useSelector} from 'react-redux';
import {
	selectStats,
	responseTimes,
	cacheLatencies,
} from '../storeRedux/dashboardSlice';
import {Line, Pie} from 'react-chartjs-2';
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

export default function Dashboard() {
	const stats = useSelector(selectStats);

	const cpuUsage = stats.cpuUsage || 0;
	const memoryUsage = stats.memoryUsage || 0;
	const diskUsage = stats.diskUsage || 0;

	const streamNumber = stats.streamNumber || 0;
	const activeUsersNumber = stats.activeUsersNumber || 0;
	const usedStorage = stats.usedStorage || 0;
	const mediaTreatmentTime = stats.mediaTreatmentTime || 0;
	const successRate = stats.successRate || 0;

	// Chart data
	const linedata = {
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

	const dataCpu = {
		labels: ['Usage', 'Free'],
		datasets: [
			{
				data: [cpuUsage, 100 - cpuUsage],
				backgroundColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
				borderColor: ['rgb(75, 192, 192)', 'rgb(211, 211, 211)'],
			},
		],
	};

	const dataMemory = {
		labels: ['Usage', 'Free'],
		datasets: [
			{
				data: [memoryUsage, 100 - memoryUsage],
				backgroundColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
				borderColor: ['rgb(255, 99, 132)', 'rgb(211, 211, 211)'],
			},
		],
	};

	const dataDisk = {
		labels: ['Usage', 'Free'],
		datasets: [
			{
				data: [diskUsage, 100 - diskUsage],
				backgroundColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
				borderColor: ['rgb(54, 162, 235)', 'rgb(211, 211, 211)'],
			},
		],
	};

	const successFailureRates = {
		labels: ['Success', 'Failure'],
		datasets: [
			{
				data: [successRate, 100 - successRate],
				backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
				borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
			},
		],
	};

	const optionsCircle = {
		plugins: {
			legend: {
				position: 'right',
				labels: {
					boxWidth: 20,
					padding: 10,
				},
			},
		},
	};

	// Add DashboardTop
	return (
		<DashboardContainer>
			<h1>Dashboard</h1>
			<Card>
				<h2>System performance metrics</h2>
				<Curve>
					<h3>Time response of API requests and Redis cache latency</h3>
					<Line data={linedata} />
				</Curve>

				<h3>Server ressource usage</h3>
				<MetricsContainer>
					<div className="metric-item">
						<p>CPU : {cpuUsage}%</p>
						<Circle>
							<Pie data={dataCpu} options={optionsCircle} />
						</Circle>
					</div>
					<div className="metric-item">
						<p>Memory : {memoryUsage}%</p>
						<Circle>
							<Pie data={dataMemory} options={optionsCircle} />
						</Circle>
					</div>
					<div className="metric-item">
						<p>Disk : {diskUsage}%</p>
						<Circle>
							<Pie data={dataDisk} options={optionsCircle} />
						</Circle>
					</div>
				</MetricsContainer>
				<p>Bandwith usage : {stats.bandwithUsage}Gbps</p>
			</Card>

			<Card>
				<h2>Business metrics</h2>
				<MetricsContainer>
					<p>Streams : {streamNumber} </p>
					<p>Active users : {activeUsersNumber}</p>
					<p>Used storage : {usedStorage}Gb</p>
					<p>Media treatment time : {mediaTreatmentTime}ms</p>
				</MetricsContainer>
				<MetricsContainer>
					<div className="metric-item">
						<p>Success rate : {successRate}%</p>
						<Circle>
							<Pie data={successFailureRates} options={optionsCircle} />
						</Circle>
					</div>
				</MetricsContainer>
			</Card>
		</DashboardContainer>
	);
}
