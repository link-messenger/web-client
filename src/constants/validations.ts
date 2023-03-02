import * as yup from 'yup';

export const LOGIN_VALIDATION = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export const REGISTER_VALIDATION = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      'Passwords must match',
    ),
});

export const CREATE_ROOM_VALIDATION = yup.object({
  name: yup.string().required()
})