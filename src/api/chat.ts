import { get } from './base';

export type Categories = 'group' | 'user';

export const getLastMessages = async (
	id: string,
	type: Categories,
	page?: number
) =>
	get(`message/${type}/${id}`, {
		params: {
			page,
		},
	}).then((res) => res.data);

export const getUserGroup = () => get('/group').then((res) => res.data);

export const getUserGroupDetail = (id: string) =>
	get(`/group/${id}`).then((res) => res.data);

export const getUserConversation = () =>
	get('/conversation').then((res) => res.data);