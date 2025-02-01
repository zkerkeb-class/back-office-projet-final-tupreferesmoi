import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
	updateKpiConfig,
	selectKpiConfig,
} from '../../storeRedux/dashboardSlice';
import {saveKpiConfig} from '../../utils/cookies';
import {DndContext, closestCenter} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
	useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {
	ButtonsContainer,
	ButtonContainer,
	ConfigContainer,
	KpiContainer,
} from './style';

const SortableKpi = ({
	id,
	kpi,
	onSelectionChange,
	onAlertChange,
	onVisualizationChange,
}) => {
	const {attributes, listeners, setNodeRef, transform, transition} =
		useSortable({id});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<KpiContainer ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<h3>{kpi.label}</h3>
			<label>
				<input
					type="checkbox"
					checked={kpi.enabled}
					onChange={() => onSelectionChange(id)}
				/>
				Display this KPI
			</label>
			<div>
				<label>
					Warning level:
					<input
						type="number"
						value={kpi.alertThreshold || ''}
						onChange={(e) => onAlertChange(id, e.target.value)}
					/>
				</label>
			</div>
			<div>
				<label>
					Visualization type:
					<select
						value={kpi.visualizationType}
						onChange={(e) => onVisualizationChange(id, e.target.value)}
					>
						<option value="graph">Graph</option>
						<option value="counter">Counter</option>
						<option value="gauge">Gauge</option>
					</select>
				</label>
			</div>
		</KpiContainer>
	);
};

export default function KpiConfigurator() {
	const dispatch = useDispatch();
	const kpiConfig = useSelector(selectKpiConfig);

	const handleSelectionChange = (id) => {
		dispatch(
			updateKpiConfig({id, key: 'enabled', value: !kpiConfig[id].enabled})
		);
	};

	const handleAlertChange = (id, threshold) => {
		dispatch(updateKpiConfig({id, key: 'alertThreshold', value: threshold}));
	};

	const handleVisualizationChange = (id, type) => {
		dispatch(updateKpiConfig({id, key: 'visualizationType', value: type}));
	};

	const handleSave = (newConfig) => {
		dispatch(updateKpiConfig(newConfig));
		saveKpiConfig(newConfig);

		// Reload page
		window.location.reload();
	};

	const resetKpiConfig = () => {
		document.cookie =
			'kpiConfig=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

		window.location.reload();
	};

	const handleDragEnd = (event) => {
		const {active, over} = event;

		if (active.id !== over.id) {
			const oldIndex = Object.keys(kpiConfig).indexOf(active.id);
			const newIndex = Object.keys(kpiConfig).indexOf(over.id);

			const reorderedKpis = arrayMove(
				Object.entries(kpiConfig),
				oldIndex,
				newIndex
			).reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {});

			dispatch(updateKpiConfig(reorderedKpis));
		}
	};

	// Modify return by following advice
	return (
		<div>
			<h2>Configure KPIs</h2>
			<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext
					items={Object.keys(kpiConfig)}
					strategy={verticalListSortingStrategy}
				>
					<ConfigContainer>
						{Object.keys(kpiConfig).map((id) => (
							<SortableKpi
								key={id}
								id={id}
								kpi={kpiConfig[id]}
								onSelectionChange={handleSelectionChange}
								onAlertChange={handleAlertChange}
								onVisualizationChange={handleVisualizationChange}
							/>
						))}
					</ConfigContainer>
				</SortableContext>
			</DndContext>
			<ButtonsContainer>
				<ButtonContainer>
					<button onClick={() => handleSave(kpiConfig)}>Save</button>
				</ButtonContainer>
				<ButtonContainer>
					<button onClick={() => resetKpiConfig({...kpiConfig})}>Reset</button>
				</ButtonContainer>
			</ButtonsContainer>
		</div>
	);
}
