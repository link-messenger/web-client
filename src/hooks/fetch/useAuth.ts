import { login, register, setApiHeader } from 'api';
import { useMutation } from 'react-query';
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
