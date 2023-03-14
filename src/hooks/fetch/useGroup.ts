import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserGroup, getUserGroupDetail, postCreateGroup } from 'api';
import { IGroup, IGroupDetail } from 'interfaces';

export const useCreateGroup = () => {
	return useMutation(['CREATE-GROUP'], postCreateGroup);
};

export const useGetUserGroup = () => {
	return useQuery<IGroup[]>(['USER-GROUPS'], getUserGroup);
};

export const useGetUserGroupDetail = (id: string) => {
	return useQuery<IGroupDetail>(
		['USER-GROUP-Detail', id],
		() => getUserGroupDetail(id),
		{
			enabled: !!id,
		}
	);
};
