import Cookies from 'js-cookie';
import kpiDefaults from '../app/KPIs.json';

const COOKIE_NAME = 'kpiConfig';

export function getkpiConfig() {
	const cookieData = Cookies.get(COOKIE_NAME);

	if (cookieData) {
		try {
			return JSON.parse(cookieData);
		} catch (error) {
			console.error('Error parsing KPI config cookie:', error);
			return null;
		}
	}

	return null;
}

export function initializeKpiConfig() {
	const existingConfig = getkpiConfig();

	if (!existingConfig) {
		Cookies.set(COOKIE_NAME, JSON.stringify(kpiDefaults), {expires: 30}); // Expires after 30 days
		return kpiDefaults;
	}

	return existingConfig;
}

export function saveKpiConfig(newConfig) {
	Cookies.set(COOKIE_NAME, JSON.stringify(newConfig), {expires: 30});
}
