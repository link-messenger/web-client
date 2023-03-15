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
	put(`/group/${id}`, data).then(res => res.data);

export const deleteUserGroup = (id: string) => deleteApi(`/group/${id}`);

export const grantUserGroupRole = ({ id, uid, role }: { id: string, uid: string, role: string }) =>
	post(`/group/${id}/role/${uid}`, {role }).then((res) => res.data);