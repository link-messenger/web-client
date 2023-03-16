import { createUserConversation, getUserConversation, getUserGroup } from 'api';
import { IConversation, IGroup } from 'interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useGetUserConversation = () => {
	return useQuery<IConversation[]>(['USER-CONVERSATION'], getUserConversation);
};

export const useCreateUserConversation = () => {
	return useMutation<
		IConversation,
		AxiosError,
		{ targetUser: string },
		unknown
	>(['CREATE-CONV'], createUserConversation);
};
