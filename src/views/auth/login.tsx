import { pb } from 'api';
import {
  NormalInput,
  PasswordInput,
  Button,
} from 'components';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
} from 'formik';
import { EN_US } from 'languages';
import { Link } from 'react-router-dom';

import {
  LOGIN_INITIALS,
  LOGIN_VALIDATION,
} from 'constants';
import { useLogin } from 'hooks';
import { GoogleAuth, LoginHeader, Seprator } from 'components/partials';

const Login = () => {
  const { mutate: login } = useLogin();
  const onHandleLogin = async (
    data: typeof LOGIN_INITIALS,
  ) => {
    login(data);
  };

  return (
		<section className="space-y-7">
			<LoginHeader />
			<Formik
				initialValues={LOGIN_INITIALS}
				validationSchema={LOGIN_VALIDATION}
				onSubmit={onHandleLogin}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{({ errors }) => (
					<Form className="w-full md:w-[400px] space-y-4">
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
						<section className="text-right text-sm font-medium text-sky-700">
							<Link to="/forgetpass">{EN_US['login.ForgetPassword']}</Link>
						</section>
						<Button type="submit">{EN_US['login.Login']}</Button>
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
				<Link to="/register" className="text-sky-700 font-medium">
					{EN_US['login.SignUp']}
				</Link>
			</section>
		</section>
	);
};

export default Login;
