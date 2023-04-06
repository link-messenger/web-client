import React, { LegacyRef, useEffect, useRef, useState } from 'react';
// @ts-expect-error
import IsScrolling from 'react-is-scrolling';

import { DateTag, MessageBox } from 'components';
import { useChatScroll, useScrollObserver } from 'hooks';
import { IProfile } from 'interfaces';
import { EN_US } from 'languages';
import { useChatListStore, useChatStore } from 'store';
import { scrollToBottom } from 'utils/scroll';
import { useQuery } from 'react-query';

interface ChatBoxProps {
	user: IProfile;
	isScrolling: boolean;
}

const ChatBoxComponent = ({ isScrolling, user }: ChatBoxProps) => {
	const [page, setPage] = useState(1);
	const clearChat = useChatStore((state) => state.clearChat);
	const loadChat = useChatStore((state) => state.loadChat);


	const messageConfirmListener = useChatStore(
		(state) => state.messageConfirmListener
	);
	const chats = useChatStore((state) => state.currentMessages);
	const isChatLoading = useChatStore((state) => state.chatLoading);
	const hasMore = useChatStore((state) => state.pages.hasMore);
	const hasLess = useChatStore((state) => state.pages.hasLess);
	const currentChatId = useChatStore((state) => state.currentChat);
	const currentChat = useChatListStore((state) => state.currentChat);

	const ref = useChatScroll(chats);
	const lObserver = useRef<IntersectionObserver>();
	const fObserver = useRef<IntersectionObserver>();
	const lastMessageElementRef = useScrollObserver(
		lObserver,
		() => setPage((page: number) => page + 1),
		isChatLoading,
		hasMore
	);
	const firstMessageElement = useScrollObserver(
		fObserver,
		() => setPage((page: number) => page - 1),
		isChatLoading,
		hasLess
	);

	useEffect(() => {
		if (!currentChatId) return;
		loadChat(currentChat, page);
	}, [currentChatId, page]);

	useEffect(() => {
		if (!currentChatId) return;
		const clearConfirmListener = messageConfirmListener();
		return () => {
			clearConfirmListener && clearConfirmListener();
			setPage(1);
			clearChat();
		};
	}, [currentChatId]);

	return (
		<section
			ref={ref}
			className="relative will-change-scroll p-4 scrollbar-hide flex-grow flex flex-col-reverse gap-1.5 overflow-auto w-full"
		>
			{isChatLoading ? (
				<section className="bg-gray-200 dark:bg-dark-lighter-gray dark:text-gray-200 bg-opacity-50 text-gray-600 px-3 text-sm rounded-full fixed top-20 left-1/2 lg:left-[calc(50%+384px)] -translate-x-1/2 lg:-translate-x-[calc(50%+192px)] z-10">
					{EN_US['common.IsLoading']}
				</section>
			) : (
				''
			)}
			{chats.map((chat, index) => (
				<MessageCreator
					key={chat._id}
					ref={
						index + 1 === chats.length
							? lastMessageElementRef
							: index === 1
							? firstMessageElement
							: undefined
					}
					data={chat}
					uid={user.id}
					modelType={chat.modelType}
				/>
			))}
			{!isScrolling && ref.current && ref.current.scrollTop < -500 && (
				<button
					onClick={() => scrollToBottom(ref)}
					className="border border-gray-100 shadow-lg fixed bottom-18 lg:bottom-24 right-3 z-10 bg-white dark:bg-dark-lighter-gray dark:border-dark-light-gray w-11 aspect-square text-center grid place-items-center rounded-full"
				>
					<i className="text-4xl text-gray-500 uil uil-angle-down"></i>
				</button>
			)}
		</section>
	);
};

const MessageCreatorComponent = (
	{ data, uid, modelType }: any,
	ref: LegacyRef<HTMLElement>
) => {
	switch (modelType) {
		case 'MESSAGE':
			return <MessageBox ref={ref} {...data} uid={uid} />;
		case 'DATE':
			return <DateTag ref={ref} {...data} />;
		default:
			return <></>;
	}
};

const MessageCreator = React.forwardRef(MessageCreatorComponent);

export const ChatBox = IsScrolling(ChatBoxComponent);
