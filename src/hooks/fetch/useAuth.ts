import { login, register, logout, setApiHeader } from 'api';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store';

export const useLogin = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const setToken = useAuthStore((state) => state.setToken);
	return useMutation(['LOGIN'], login, {
		onSuccess: ({ token }) => {
			setToken(token);
			const from = state?.from;
			if (navigate.length !== 0 && !!from) {
				if (from === '/login') navigate('/chat');
				else navigate(from);
			} else {
				navigate('/chat');
			}
		},
	});
};

export const useRegister = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const setAuth = useAuthStore((state) => state.setAuth);
	return useMutation(['REGISTER'], register, {
		onSuccess: ({ user, token }) => {
			setAuth(token, user);
			const from = state?.from;
			if (navigate.length !== 0 && !!from) {
				if (from === '/register') navigate('/chat');
				navigate(from);
			} else {
				navigate('/chat', {
					replace: true,
					state: {
						from: '/register',
					},
				});
			}
		},
	});
};

export const useLogout = () => {
	const clearAll = useAuthStore((state) => state.clearAll);
	const navigate = useNavigate();
	return useMutation(['LOGOUT'], logout, {
		onSuccess: (data) => {
			console.log(data);
			clearAll();
			navigate('/login', {
				replace: true,
				state: {
					from: '/chat'
				}
			});
		},
	});
};
