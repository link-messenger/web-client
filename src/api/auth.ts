import { FORGET_PASSWORD_INITIALS, LOGIN_INITIALS, REGISTER_INITIALS, RESET_PASSWORD_INITIALS } from 'constants';
import { IEditUserProfile } from 'interfaces';
import { deleteApi, get, post, put } from './base';

export const login = (data: { device: string } & typeof LOGIN_INITIALS) =>
	post('/auth/login', data);

export const register = (data: { device: string } & typeof REGISTER_INITIALS) =>
	post('/auth/register', data).then((res) => res.data);

export const getProfile = () => get('/auth/me').then((res) => res.data);

export const deleteAccount = () =>
	deleteApi('/auth/me').then((res) => res.data);

export const editAccount = (data: IEditUserProfile) => put('/auth/me', data);

export const postRefreshToken = (data: { refresh: string }) =>
	post('/auth/token/refresh', data).then((res) => res.data);

export const postLoginOtpVerify = (data: { otp: string }) =>
	post('/auth/otp/verify', data).then((res) => res.data);

export const postForgetPassword = (data: typeof FORGET_PASSWORD_INITIALS) =>
	post('/auth/password/forget', data).then((res) => res.data);

export const postResetPassword = (data: typeof RESET_PASSWORD_INITIALS) => post('/auth/password/reset', data).then((res) => res.data);

export const logout = () => get('/auth/logout').then((res) => res.data);
