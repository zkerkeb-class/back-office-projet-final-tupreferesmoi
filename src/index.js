import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import Dashboard from './dashboard/page';
import DashboardConfig from './dashboard/config/page';
import reportWebVitals from './reportWebVitals';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/config" element={<DashboardConfig />} />
				</Routes>
			</Router>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
