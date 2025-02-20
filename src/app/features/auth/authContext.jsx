import React, {createContext, useContext, useState, useEffect} from 'react';
import authService from '../../../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const currentUser = authService.getCurrentUser();
		setUser(currentUser?.user || null);
		setLoading(false);
	}, []);

	const login = async (credentials) => {
		const response = await authService.login(credentials);
		setUser(response.user);
		return response;
	};

	const register = async (userData) => {
		const response = await authService.register(userData);
		setUser(response.user);
		return response;
	};

	const logout = () => {
		authService.logout();
		setUser(null);
	};

	const value = {
		user,
		login,
		register,
		logout,
		loading,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
