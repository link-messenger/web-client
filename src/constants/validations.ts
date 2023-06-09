import * as yup from 'yup';

export const LOGIN_VALIDATION = yup.object({
	email: yup.string().email().required(),
	password: yup.string().min(8).required(),
});

export const REGISTER_VALIDATION = yup.object({
	email: yup.string().email().required(),
	username: yup.string().required(),
	name: yup.string().required(),
	password: yup.string().min(8).required(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match').required(),
});

export const SEND_MESSAGE_VALIDATION = yup.object({
	content: yup.string().required(),
});

export const CREATE_GROUP_VALIDATION = yup.object({
	name: yup.string().required(),
	description: yup.string().optional(),
	isPublic: yup.boolean().required(),
});

export const EDIT_GROUP_VALIDATION = yup.object({
	name: yup.string().required(),
	description: yup.string().optional(),
	isPublic: yup.boolean().required(),
});

export const FORGET_PASSWORD_VALIDATION = yup.object({
	email: yup.string().email().required(),
});

export const RESET_PASSWORD_VALIDATION = yup.object({
	password: yup.string().min(8).required(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
    .required(),
  otp: yup.string().required(),
});
