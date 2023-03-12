import { LOGIN_INITIALS, REGISTER_INITIALS } from 'constants';
import { get, post } from './base';

export const login = (data: typeof LOGIN_INITIALS) =>
	post('/auth/login', data).then((res) => res.data);

export const register = (data: typeof REGISTER_INITIALS) =>
	post('/auth/register', data).then((res) => res.data);

export const profile = () => get('/auth/me').then(res => res.data);

export const logout = () => get('/auth/logout').then((res) => res.data);