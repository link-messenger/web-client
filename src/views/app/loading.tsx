import React from 'react';

const Loading = ({ message }: { message: string }) => {
  return (
		<main className="bg-sky-50 h-screen w-screen grid place-items-center">
			<div
				className="loader__wrap"
				role="alertdialog"
				aria-busy="true"
				aria-live="polite"
				aria-label={message}
			>
				<div className="loader" aria-hidden="true">
					<div className="loader__sq"></div>
					<div className="loader__sq"></div>
				</div>
			</div>

			<p className="text-center text-sky-500 mt-20 font-medium text-2xl md:text-3xl p-4">
				{message}
			</p>
		</main>
	);
};

export default Loading;
