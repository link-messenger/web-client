import { Button } from 'components';
import { AuthHeader } from 'components/partials';
import { useLoginVerify } from 'hooks';
import { EN_US } from 'languages';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

const Verify = () => {
	const { mutate, isLoading, isError } = useLoginVerify();
	const [otp, setOtp] = useState('');
	const handleOtp = (otp: string) => {
		setOtp(otp);
	};
	const handleSubmit = () => {
		mutate({ otp });
	};
	return (
		<div className="space-y-7 text-center">
			<AuthHeader
				content={EN_US['login.OTPMessage']}
				title={EN_US['login.OTPHeader']}
			/>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
        }}
        className="flex flex-col justify-center items-center gap-10 "
			>
				<section className="flex justify-center">
					<OtpInput
						inputStyle="mx-0.5 text-gray-700 md:mx-2 text-4xl md:text-6xl border rounded-md outline-sky-500"
						separator="-"
						shouldAutoFocus
						focusStyle="border-sky-400"
						isDisabled={isLoading}
						value={otp}
						errorStyle="border-rose-400"
						numInputs={7}
						hasErrored={isError}
						onChange={handleOtp}
					/>
				</section>
				<Button type="submit" disabled={otp.length !== 7}>
					{EN_US['login.Verify']}
				</Button>
			</form>
		</div>
	);
};

export default Verify;
