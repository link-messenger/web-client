// @ts-expect-error
import IsScrolling from 'react-is-scrolling';
import { DateTag, MessageBox } from 'components/partials';
import { useChatScroll, useDebounce, useScrollObserver } from 'hooks';
import { IProfile } from 'interfaces';
import { EN_US } from 'languages';
import React, { LegacyRef, useRef, useState } from 'react';
import { useChatStore } from 'store';
import { scrollToBottom } from 'utils/scroll';
import RenderIfVisible from 'react-render-if-visible';
import { CHAT_CHUNK_LENGTH } from 'constants';

interface ChatBoxProps {
	user: IProfile;
	setPage: Function;
	isScrolling: boolean;
}

const ChatBoxComponent = ({ isScrolling, user, setPage }: ChatBoxProps) => {
	const chats = useChatStore((state) => state.currentMessages);
	const isChatLoading = useChatStore((state) => state.chatLoading);
	const hasMore = useChatStore((state) => state.pages.hasMore);
	const hasLess = useChatStore((state) => state.pages.hasLess);
	const ref = useChatScroll(chats);
	const lObserver = useRef<IntersectionObserver>();
	const fObserver = useRef<IntersectionObserver>();
	// chats.slice()
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
	const chatElems = [];

	for (let i = 0, len = chats.length; i < len; i += CHAT_CHUNK_LENGTH) {
		chatElems.unshift(
			<RenderIfVisible key={`chunk_Key_${i}`}>
				{chats.slice(i, i + CHAT_CHUNK_LENGTH).map((chat, index) => (
					<MessageCreator
						key={chat._id}
						ref={
							index === chats.length - 1
								? lastMessageElementRef
								: index === 0
								? firstMessageElement
								: undefined
						}
						data={chat}
						uid={user.id}
						modelType={chat.modelType}
					/>
				))}
			</RenderIfVisible>
		);
	}

	return (
		<section
			ref={ref}
			className="relative will-change-scroll p-4 scrollbar-hide flex-grow flex flex-col-reverse gap-1.5 overflow-auto w-full"
		>
			{isChatLoading ? (
				<section className="bg-gray-200 bg-opacity-50 text-gray-600 px-3 text-sm rounded-full fixed top-20 left-1/2 lg:left-[calc(50%+384px)] -translate-x-1/2 lg:-translate-x-[calc(50%+192px)] z-10">
					{EN_US['common.IsLoading']}
				</section>
			) : (
				''
			)}
			{chatElems}
			{!isScrolling && ref.current && ref.current.scrollTop < -500 && (
				<button
					onClick={() => scrollToBottom(ref)}
					className="border border-gray-100 shadow-lg fixed bottom-18 lg:bottom-24 right-3 z-10 bg-white w-11 aspect-square text-center grid place-items-center rounded-full"
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
