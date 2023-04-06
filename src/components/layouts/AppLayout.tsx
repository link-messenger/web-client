import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import { NavMenu } from '../partials';
export const AppLayout = () => {
	return (
		<AnimatePresence>
			<div className="bg-light-light-gray dark:bg-dark-light-gray flex flex-col-reverse h-screen w-screen lg:flex-row">
				<NavMenu />
				<Outlet />
			</div>
		</AnimatePresence>
	);
};
