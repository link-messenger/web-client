import { get } from './base';

export const getSearchChat = (name: string) =>
	get('/search/', {
		params: {
			name,
		},
	}).then((res) => res.data);
