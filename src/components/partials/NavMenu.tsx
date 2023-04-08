import { Tooltip } from '../core';
import { NAV_MENU } from 'constants';
import { NavLink } from 'react-router-dom';
import { useAuthStore, useChatStore, useThemeStore } from 'store';
import { Avatar } from './Avatar';
import { isMobile } from 'react-device-detect';

export const NavMenu = () => {
	const user = useAuthStore((state) => state.user);
	const currentChatId = useChatStore((state) => state.currentChat);
	const theme = useThemeStore((state) => state.theme);
	const setTheme = useThemeStore((state) => state.setTheme);
	return (
		<nav
			className={
				(currentChatId ? 'w-0  max-lg:hidden' : 'w-full') +
				' flex lg:gap-10 w-full h-[75px] lg:w-[75px] lg:h-full items-center justify-around lg:justify-start lg:flex-col bg-light-light-gray dark:bg-dark-light-gray py-4'
			}
		>
			<i className="uil uil-bolt-alt hidden lg:block text-primary text-4xl" />
			{NAV_MENU.map(({ icon, path, title }, index) => (
				<NavLink
					key={`MENU_ITEM_${index}`}
					className="cursor-pointer nav-menu-active max-lg:h-[75px] grid place-items-center lg:w-full text-3xl max-[430px]:text-2xl text-neutral-500"
					to={path}
				>
					<Tooltip dir={isMobile ? 'top' : 'right'} content={title}>
						<i className={icon} />
					</Tooltip>
				</NavLink>
			))}
			<section className="hidden lg:flex flex-grow flex-col justify-end items-center">
				<button
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					className="text-neutral-500 text-2xl mb-4"
				>
					<i className={theme === 'dark' ? 'uil uil-sun' : 'uil uil-moon'} />
				</button>
				<Avatar username={user?.name} />
			</section>
		</nav>
	);
};
