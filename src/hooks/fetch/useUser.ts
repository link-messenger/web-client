import { pb } from 'api';
import { useMutation, useQuery } from 'react-query';
import { string } from 'yup';

export const useGetUserProfile = ({
	onError,
}: {
	onError?: (err: unknown) => void;
}) => {
	return useQuery(
		['GET-USER-PROFILE'],
		async () => {
			return await pb.collection('users').authRefresh();
		},
		{
			onError: onError,
			select: (data) => data.record,
		}
	);
};


export const useGetUserById = ({
	id
}: { id: string }) => {
	return useQuery(['GET-USER', id], async () => {
		return await pb.collection('users').getOne(id);
	}, {
		cacheTime: 2000000
	})
}