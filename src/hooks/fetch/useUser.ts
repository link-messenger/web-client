import { profile, getUserById } from 'api';
import { useMutation, useQuery } from 'react-query';
import { useAuthStore } from 'store';

export const useGetUserProfile = ({
	onError,
}: {
	onError?: (err: unknown) => void;
}) => {
	const setUser = useAuthStore((state) => state.setUser);
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
		onError,
		cacheTime: 2000000,
		refetchInterval: false,
		refetchOnMount: true,
		retry: false,
	});
};

export const useGetUserById = ({ id }: { id: string }) => {
	return useQuery(['GET-USER', id], () => getUserById(id), {
		cacheTime: 2000000,
	});
};
