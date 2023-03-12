import { pb } from 'api';
import { Button, NormalInput, PasswordInput } from 'components';
import { AuthHeader, GoogleAuth, Seprator } from 'components/partials';
import { REGISTER_INITIALS, REGISTER_VALIDATION } from 'constants';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRegister } from 'hooks';
import { EN_US } from 'languages';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from 'store';

const Register = () => {
	const { mutate: register } = useRegister();
	const isValid = useAuthStore((state) => state.token);
	if (!!isValid) return <Navigate to="/chat" state={{ from: '/register' }} />;
	const onHandleRegister = (data: typeof REGISTER_INITIALS) => {
		register(data);
	};
	return (
		<section className="space-y-7">
			<AuthHeader
				content={EN_US['register.WelcomeSubtitle']}
				title={EN_US['register.Welcome']}
			/>
			<Formik
				initialValues={REGISTER_INITIALS}
				validationSchema={REGISTER_VALIDATION}
				onSubmit={onHandleRegister}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{({ errors }) => (
					<Form className="w-full md:w-[500px] space-y-4">
						<section className="flex flex-col sm:flex-row gap-4">
							<Field
								as={NormalInput}
								icon={<i className="uil uil-user"></i>}
								type="text"
								id="name"
								placeholder="Enter your fullname"
								name="name"
							/>
							<Field
								as={NormalInput}
								icon={<i className="uil uil-user-square"></i>}
								type="text"
								id="username"
								placeholder="Pick up a username"
								name="username"
							/>
						</section>
						<Field
							as={NormalInput}
							icon={<i className="uil uil-envelopes"></i>}
							type="email"
							id="email"
							placeholder="you@example.com"
							name="email"
						/>
						<Field
							name="password"
							as={PasswordInput}
							placeholder="At least 8 characters"
							id="password"
						/>
						<Field
							name="confirmPassword"
							as={NormalInput}
							icon={<i className="uil uil-shield-check"></i>}
							type="password"
							placeholder="Type your password again"
							id="confirmPassword"
						/>
						<section className="text-right text-sm font-medium text-sky-700">
							<Link to="/forgetpass">{EN_US['login.ForgetPassword']}</Link>
						</section>
						<Button type="submit">{EN_US['register.Register']}</Button>
						<section className="text-rose-400">
							{Object.keys(errors).map((key: string) => (
								<ErrorMessage name={key} />
							))}
						</section>
					</Form>
				)}
			</Formik>

			<Seprator />

			<GoogleAuth />
			<section className="text-sm flex justify-center items-baseline space-x-2">
				<p className="text-slate-500">{EN_US['register.SignInMessage']}</p>
				<Link to="/login" className="text-sky-700 font-medium">
					{EN_US['register.SignIn']}
				</Link>
			</section>
		</section>
	);
};

export default Register;
