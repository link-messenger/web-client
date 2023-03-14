import { profile, getUserById } from 'api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'store';

export const useGetUserProfile = () => {
	const setUser = useAuthStore((state) => state.setUser);
	const clearAll = useAuthStore((state) => state.clearAll);
	const navigate = useNavigate();
	return useQuery(['GET-USER-PROFILE'], profile, {
		onSuccess: ({ createdAt, id, email, name, username }) => {
			setUser({
				createdAt,
				email,
				id,
				name,
				username,
			});
		},
		cacheTime: 2000000,
	});
};

export const useGetUserById = ({ id }: { id: string }) => {
	return useQuery(['GET-USER', id], () => getUserById(id), {
		cacheTime: 2000000,
	});
};
