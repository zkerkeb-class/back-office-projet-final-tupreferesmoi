import React from 'react';
import {Pie, Doughnut} from 'react-chartjs-2';

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

const optionsGauge = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	rotation: 270,
	circumference: 180,
};

const KpiChart = ({kpi, data}) => {
	if (!data || !data.datasets || data.datasets.length === 0) {
		return <p>No data available for this KPI</p>;
	}

	return (
		<>
			{kpi.type === 'circle' && data ? (
				<Pie data={data} options={optionsCircle} />
			) : kpi.type === 'gauge' && data ? (
				<Doughnut data={data} options={optionsGauge} />
			) : kpi.type === 'text' && data ? (
				<p>{data.datasets[0].data[0]}</p>
			) : (
				<p>Unsupported KPI type</p>
			)}
		</>
	);
};

export default KpiChart;
