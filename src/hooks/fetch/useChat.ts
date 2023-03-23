import { createUserConversation, getUserChatList, getUserConversation } from 'api';
import { IChat, IConversation } from 'interfaces';
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


export const useGetUserChatList = () => {
	return useQuery<IChat[]>(['GET-USER-CHAT-LIST'], getUserChatList);
}