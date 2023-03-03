import { pb } from 'api';
import { LOGIN_INITIALS, REGISTER_INITIALS } from 'constants';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export const useLogin = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	return useMutation(
		['LOGIN'],
		(data: typeof LOGIN_INITIALS) =>
			pb.collection('users').authWithPassword(data.email, data.password),
		{
			onSuccess: () => {
				const from = state?.from;
				if (navigate.length !== 0 && !state.from) {
					if (from === '/login') navigate('/chat');
					else navigate(from);
				} else {
					navigate(from, { state: { from: '/login'}});
				}
			},
		}
	);
};

export const useRegister = () => {
	const navigate = useNavigate();
	return useMutation(
		['REGISTER'],
		(data: typeof REGISTER_INITIALS) => {
			const rData = {
				username: data.username,
				password: data.password,
				name: data.name,
				email: data.email,
				emailVisibility: true,
				passwordConfirm: data.confirmPassword,
			};
			return pb.collection('users').create(rData);
		},
		{
			onSuccess: () => {
				if (navigate.length !== 0) {
					navigate(-1);
				} else {
					navigate('/chat', {
						replace: true,
						state: {
							from: '/register'
						}
					});
				}
			},
		}
	);
};
