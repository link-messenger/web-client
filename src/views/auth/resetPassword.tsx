import { ErrorMessage, Field, Form, Formik } from 'formik';

import { Button, NormalInput, PasswordInput, AuthHeader } from 'components';
import {
  RESET_PASSWORD_INITIALS,
  RESET_PASSWORD_VALIDATION,
} from 'constants';
import { useResetPassword } from 'hooks';
import { EN_US } from 'languages';

const ResetPassword = () => {
	const { mutate, isLoading } = useResetPassword();
	const handleResetPassword = (data: typeof RESET_PASSWORD_INITIALS) => {
		mutate(data);
	};
	return (
		<div className="space-y-7">
			<AuthHeader
				content={EN_US['login.ResetPasswordMessage']}
				title={EN_US['login.ResetPasswordHeader']}
			/>
			<Formik
				initialValues={RESET_PASSWORD_INITIALS}
				validationSchema={RESET_PASSWORD_VALIDATION}
				onSubmit={handleResetPassword}
				validateOnChange={false}
				validateOnBlur={false}
			>
				{({ errors }) => (
					<Form className="w-full md:w-[500px] space-y-4">
						<Field
							as={NormalInput}
							icon={<i className="uil uil-history-alt"></i>}
							type="text"
							id="otp"
							placeholder="Enter reset Code"
							name="otp"
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
						<Button disabled={isLoading} type="submit">
							{EN_US['login.ResetPassword']}
						</Button>
						<section className="text-rose-400">
							{Object.keys(errors).map((key: string) => (
								<ErrorMessage name={key} />
							))}
						</section>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default ResetPassword;
