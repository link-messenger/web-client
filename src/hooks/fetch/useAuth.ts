import {
	login,
	register,
	logout,
	setApiHeader,
	postLoginOtpVerify,
	postForgetPassword,
	postResetPassword,
} from 'api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store';

export const useLogin = () => {
	const navigate = useNavigate();

	const setToken = useAuthStore((state) => state.setToken);
	return useMutation(['LOGIN'], login, {
		onSuccess: (data) => {
			if (data.status === 201) {
				navigate('/verify');
			} else {
				const { token, refresh } = data.data;
				setToken(token, refresh);
				navigate('/chat', { replace: true });
			}
		},
	});
};

export const useRegister = () => {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);
	return useMutation(['REGISTER'], register, {
		onSuccess: ({ user, token, refresh }) => {
			setAuth(token, refresh, user);
			navigate('/chat', { replace: true });
		},
	});
};

export const useLogout = () => {
	const clearAll = useAuthStore((state) => state.clearAll);
	const navigate = useNavigate();
	return useMutation(['LOGOUT'], logout, {
		onSuccess: (data) => {
			clearAll();
			navigate('/login', {
				replace: true,
			});
		},
	});
};

export const useLoginVerify = () => {
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);
	return useMutation(['LOGIN_VERIFY'], postLoginOtpVerify, {
		onSuccess: ({ token, refresh }) => {
			setToken(token, refresh);
			navigate('/chat', { replace: true });
		},
	});
};

export const useForgetPassword = () => {
	const navigate = useNavigate();
	return useMutation(['FORGET_PASSWORD'], postForgetPassword, {
		onSuccess: () => {
			navigate('/resetpass');
		},
	});
};

export const useResetPassword = () => {
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);
	return useMutation(['RESET_PASSWORD'], postResetPassword, {
		onSuccess: ({ token, refresh }) => {
			setToken(token, refresh);
			navigate('/chat', { replace: true });
		},
	});
};
