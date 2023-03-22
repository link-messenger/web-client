import { Button, NormalInput } from 'components';
import { AuthHeader } from 'components/partials';
import {
	FORGET_PASSWORD_INITIALS,
	FORGET_PASSWORD_VALIDATION,
	LOGIN_VALIDATION,
} from 'constants';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useForgetPassword } from 'hooks';
import { EN_US } from 'languages';
import React from 'react';

const ForgetPassword = () => {
	const { mutate , isLoading} = useForgetPassword();
	const handleForgetPassword = (data: typeof FORGET_PASSWORD_INITIALS) => {
		mutate(data);
	};
	return (
		<div className="space-y-7">
			<AuthHeader
				content={EN_US['login.ForgetPasswordMessage']}
				title={EN_US['login.ForgetPasswordHeader']}
			/>
			<Formik
				initialValues={FORGET_PASSWORD_INITIALS}
				validationSchema={FORGET_PASSWORD_VALIDATION}
				onSubmit={handleForgetPassword}
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
						<Button disabled={isLoading} type="submit">{EN_US['login.GetCode']}</Button>
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

export default ForgetPassword;
