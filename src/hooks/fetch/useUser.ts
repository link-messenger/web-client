import { pb } from 'api';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

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

export const useCreateUserRoom = () => {
	return useMutation(
		['CREATE-USER-ROOM'],
		async ({
			prefrences,
		}: {
			prefrences: {
				video: boolean;
				audio: boolean;
				screen: boolean;
			};
		}) => {
			return pb.collection('user_room').create({
				user: pb.authStore.model?.id,
				prefrences,
			});
		}
	);
};
