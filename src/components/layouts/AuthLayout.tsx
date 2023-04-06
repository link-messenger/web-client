import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
	return (
		<section className="w-screen p-3 sm:p-0 min-h-screen flex">
			<section className="hidden bg-indigo-100 xl:block lg:w-2/5 "></section>
			<section className="flex-1 flex flex-col p-3 sm:p-6 md:p-8 lg:p-0 justify-center items-center">
				<Outlet />
			</section>
		</section>
	);
};
