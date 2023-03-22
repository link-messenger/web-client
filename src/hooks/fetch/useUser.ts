import { getProfile, getUserById } from 'api';
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
		cacheTime: 2000000,
	});
};

export const useGetUserById = ({ id }: { id: string }) => {
	return useQuery(['GET-USER', id], () => getUserById(id), {
		cacheTime: 2000000,
	});
};


