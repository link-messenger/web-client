import { useMutation, useQuery } from '@tanstack/react-query';
import {
	Categories,
	deleteUserGroup,
	getUserGroup,
	getUserGroupDetail,
	grantUserGroupRole,
	postCreateGroup,
	putUserGroupEdit,
} from 'api';
import { AxiosError } from 'axios';
import { IGroup, IGroupDetail } from 'interfaces';
import { useChatListStore, useChatStore } from 'store';

export const useCreateGroup = () => {
	return useMutation(['CREATE-GROUP'], postCreateGroup);
};

export const useGetUserGroup = () => {
	return useQuery<IGroup[]>(['USER-GROUPS'], getUserGroup);
};

export const useGetUserGroupDetail = (id: string, type?: Categories) => {
	const removeGroup = useChatListStore(state => state.removeGroup);
	const setCurrentChat = useChatStore(state => state.setCurrentChatId);
	return useQuery<IGroupDetail, AxiosError>(
		['USER-GROUP-Detail', id],
		() => getUserGroupDetail(id),
		{
			enabled: !!id && type === 'group',
			onError: (err) => {
				if (err.response?.status === 404) {
					removeGroup(id);
					setCurrentChat('');
				}
			},
		}
	);
};

export const useEditGroup = (id: string) => {
	return useMutation(['USER-GROUP-EDIT', id], putUserGroupEdit(id));
};

export const useDeleteGroup = (id: string) => {
	const setReloadChat = useChatListStore(state => state.setReloadChat);
	return useMutation(['DELETE-GROUP', id], () => deleteUserGroup(id), {
		onMutate: () => {
			setReloadChat(true);
		},
		onSuccess: () => {
			setReloadChat(false);
		},
	});
};


export const useGrantRoleGroup = (id: string) => {
	return useMutation(['GRANT-ROLE-GROUP', id], grantUserGroupRole);
}