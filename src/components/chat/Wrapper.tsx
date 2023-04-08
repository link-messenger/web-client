import { PropsWithChildren } from 'react';
import { useChatStore } from 'store';

interface ListWrapper extends PropsWithChildren {
	title: string;
}

export const MainListWrapper = ({ title, children }: ListWrapper) => {
	const currentChatId = useChatStore((state) => state.currentChat);
	return (
		<section
			className={
				(currentChatId ? 'w-0  max-lg:hidden' : 'w-full') +
				' lg:w-[345px] flex flex-col flex-grow lg:flex-grow-0 bg-white py-5 px-4 gap-5 dark:bg-dark-gray'
			}
		>
			<header className="text-xl dark:text-gray-400 font-medium">
				{title}
			</header>
			{children}
		</section>
	);
};

export const ProfileListWrapper = ({ title, children }: ListWrapper) => {
	const currentChatId = useChatStore((state) => state.currentChat);
	return (
		<section
			className={
				(currentChatId ? 'w-0  max-lg:hidden' : 'w-full') +
				' lg:w-[345px] flex flex-col flex-grow lg:flex-grow-0 bg-white gap-5 dark:bg-dark-gray'
			}
		>
			<header className="text-xl dark:text-gray-400 font-medium border-b border-light-border-gray dark:border-b-dark-light-gray">
				<section className=" h-44 overflow-hidden object-cover relative ">
					<img
						src="https://picsum.photos/600"
						alt=":background profile"
						className="w-full"
					/>
					<p className="absolute top-0 left-0 z-20 px-4 py-5 text-white inset-0 bg-gradient-to-b from-dark-gray to-transparent">
						{title}
					</p>
				</section>
			</header>
			<section className="py-5 px-4">{children}</section>
		</section>
	);
};
