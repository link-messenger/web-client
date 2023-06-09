import { NormalInput, PasswordInput, Button } from 'components';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { EN_US } from 'languages';
import { Link, Navigate } from 'react-router-dom';

import { LOGIN_INITIALS, LOGIN_VALIDATION } from 'constants';
import { useLogin } from 'hooks';
import { GoogleAuth, AuthHeader, Seprator } from 'components/partials';
import { useAuthStore } from 'store';
import { getDevice } from 'utils/device';

const Login = () => {
	const { mutate: login, isLoading } = useLogin();
	const isValid = useAuthStore((state) => state.token);
	if (!!isValid) return <Navigate to="/chat" />;

	const onHandleLogin = async (data: typeof LOGIN_INITIALS) => {
		login({
			...data,
			device: getDevice(),
		});
	};

	return (
		<section className="space-y-7">
			<AuthHeader
				content={EN_US['login.WelcomeSubtitle']}
				title={EN_US['login.Welcome']}
			/>
			<Formik
				initialValues={LOGIN_INITIALS}
				validationSchema={LOGIN_VALIDATION}
				onSubmit={onHandleLogin}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{({ errors }) => (
					<Form className="w-full md:w-[500px] space-y-4">
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
						<section className="text-right text-sm font-medium text-indigo-700">
							<Link to="/forgetpass">{EN_US['login.ForgetPassword']}</Link>
						</section>
						<Button disabled={isLoading} type="submit">
							{EN_US['login.Login']}
						</Button>
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
				<p className="text-slate-500">{EN_US['login.SignUpMessage']}</p>
				<Link to="/register" className="text-indigo-700 font-medium">
					{EN_US['login.SignUp']}
				</Link>
			</section>
		</section>
	);
};

export default Login;
