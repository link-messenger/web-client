import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
	return (
		<section className="w-screen h-screen flex">
			<section className="hidden bg-blue-50 xl:block lg:w-2/5 "></section>
			<section className="flex-1 flex flex-col justify-center items-center">
				<Outlet />
			</section>
		</section>
	);
};
