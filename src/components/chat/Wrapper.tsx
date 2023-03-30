import { PropsWithChildren } from "react";
import { useChatStore } from "store";

export const MainListWrapper = ({
	title,
	children,
}: { title: string } & PropsWithChildren) => {
	const currentChatId = useChatStore((state) => state.currentChat);
	return (
		<section
			className={
				(currentChatId ? 'w-0  max-lg:hidden' : 'w-full') +
				' lg:w-[345px] flex flex-col flex-grow lg:flex-grow-0 bg-white py-6 px-3.5 gap-5 dark:bg-dark-gray'
			}
		>
			<header className="text-xl dark:text-gray-400 font-medium">
				{title}
			</header>
			{children}
		</section>
	);
};
