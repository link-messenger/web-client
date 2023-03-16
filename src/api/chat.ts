import { get, post } from './base';

export type Categories = 'group' | 'user';

export const getLastMessages = async (
	id: string,
	type: Categories,
	page?: number
) => {
	return get(`message/${type}/${id}`, {
		params: {
			page,
		},
	}).then((res) => res.data);
};

export const getUserGroup = () => get('/group').then((res) => res.data);

export const getUserConversation = () =>
	get('/conversation').then((res) => res.data);

export const createUserConversation = (data: {
	targetUser: string;
}) => post('/conversation', data).then((res) => res.data);
