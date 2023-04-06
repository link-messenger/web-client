import { getProfile, getUserById, editAccount, deleteAccount } from 'api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store';

export const useGetUserProfile = () => {
	const setUser = useAuthStore((state) => state.setUser);
	return useQuery(['GET-USER-PROFILE'], getProfile, {
		onSuccess: ({ createdAt, id, email, name, username }) => {
			setUser({
				createdAt,
				email,
				id,
				name,
				username,
			});
		},
		retry: 3,
		cacheTime: 2000000,
	});
};

export const useGetUserById = ({ id }: { id: string }) => {
	return useQuery(['GET-USER', id], () => getUserById(id), {
		cacheTime: 2000000,
	});
};

export const useEditProfile = () => {
	return useMutation(['EDIT-PROFILE'], editAccount);
};

export const useDeleteAccount = () => {
	const navigate = useNavigate();
	const clearAll = useAuthStore((state) => state.clearAll);
	return useMutation(['DELETE-ACCOUNT'], deleteAccount, {
		onSuccess: () => {
			navigate('/login');
			clearAll();
		},
	});
};
