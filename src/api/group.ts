import { CREATE_GROUP_INITIALS } from 'constants';
import { deleteApi, get, post, put } from './base';

type CreateGroup = Omit<typeof CREATE_GROUP_INITIALS, 'isPublic'> & {
	status: string;
};
export const postCreateGroup = (data: CreateGroup) =>
	post('/group', data).then((res) => res.data);

export const getUserGroupDetail = (id: string) =>
	get(`/group/${id}`).then((res) => res.data);

export const putUserGroupEdit = (id: string) => (data: CreateGroup) =>
	put(`/group/${id}`, data);

export const deleteUserGroup = (id: string) => deleteApi(`/group/${id}`);