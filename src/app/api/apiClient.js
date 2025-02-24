import axios from 'axios';
//const dotenv = require("dotenv");

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// // Intercepteur pour ajouter le token si nécessaire
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
