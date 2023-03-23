import { KeyboardEvent, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';

import {
	GroupProfileEditModal,
	GroupProfileModal,
	ListAvatar,
} from '../partials';
import { CHAT_INFO_MODAL } from 'constants';
import { EN_US } from 'languages';
import { useChatListStore, useChatStore } from 'store';
import { useGetUserGroupDetail, useModal } from 'hooks';
import { MessageTypes } from 'store';
import { IGroupDetail, IProfile } from 'interfaces';
import { Categories } from 'api';
import { ChatBox } from './ChatBox';

const chatContentVariant:Variants = {
	hidden: {
		x: '100%',
		opacity: 0,
		width:0,
		transitionEnd: {
			display: 'none',
		},
		transition: {
			duration: 0.1,
			ease: 'easeInOut',
		},
	},
	visible: {
		display: 'flex',
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.1,
			ease: 'easeInOut',
		},
	},
};

export const ChatContent = ({ user }: { user: IProfile }) => {
	const { currentId, openModal, closeModal } = useModal();
	const currentChatId = useChatStore((state) => state.currentChat);
	const currentChat = useChatListStore((state) => state.currentChat);

	const { data: groupDetail, refetch } = useGetUserGroupDetail(
		currentChatId,
		currentChat?.type as Categories
	);

	// if (!currentChatId || !currentChat)
	// 	return (
	// 		<section className="chat-bg-1 bg-gray-50 relative w-0 hidden flex-grow lg:grid place-items-center text-sky-500 text-xl"></section>
	// 	);

	return (
		<motion.section variants={chatContentVariant}
			initial="hidden"
			animate={currentChatId ? "visible" : "hidden"}
			className="flex-col flex-grow h-full overflow-hidden will-change-contents">
			<ChatContentHeader
				groupDetail={groupDetail}
				openModal={openModal}
				user={user}
			/>
			<ChatBox user={user} />
			<ChatContentMessage />
			{groupDetail && (
				<GroupProfileModal
					refetch={refetch}
					user={user}
					openModal={openModal}
					groupDetail={groupDetail}
					currentId={currentId}
					closeModal={closeModal}
				/>
			)}

			{groupDetail && (
				<GroupProfileEditModal
					user={user}
					openModal={openModal}
					refetch={refetch}
					groupDetail={groupDetail}
					currentId={currentId}
					closeModal={closeModal}
				/>
			)}
		</motion.section>
	);
};

const ChatContentMessage = () => {
	const [mType, setMType] = useState<MessageTypes>('MESSAGE');
	const sendMessage = useChatStore((state) => state.sendMessage);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const lineRef = useRef(1);

	const currentChatId = useChatStore((state) => state.currentChat);
	const currentChat = useChatListStore((state) => state.currentChat);

	const onSendMessage = () => {
		if (
			!currentChat ||
			!inputRef.current ||
			inputRef.current.value.trim().length === 0
		)
			return;
		sendMessage({
			content: inputRef.current.value,
			to: currentChatId,
			type: mType,
			model: currentChat.type as Categories,
		});
		inputRef.current.value = '';
		lineRef.current = 1;
		inputRef.current.style.height = `${lineRef.current * 20}px`;
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!inputRef) return;

		if (event.shiftKey && event.key === 'Enter') {
			if (inputRef.current && lineRef.current < 10) {
				lineRef.current = lineRef.current + 1;
				inputRef.current.style.height = `${lineRef.current * 20}px`;
			}
		} else if (event.key === 'Enter') {
			event.preventDefault();
			onSendMessage();
		}
		if (event.key === 'Backspace') {
			if (inputRef.current) {
				const lines = inputRef.current.value.split('\n');
				if (lines.length - 1 === 0) return;
				const lastLine = lines[lines.length - 1];
				if (lastLine === '' && lineRef.current > 1) {
					lineRef.current = lineRef.current - 1;
					inputRef.current.style.height = `${lineRef.current * 20}px`;
				}
			}
		}
	};

	return (
		<section className="w-full gap-2 p-2 lg:p-4 border-t bg-white border-gray-100">
			<section className="bg-gray-50 p-2 flex items-center justify-between gap-0.5 rounded-lg">
				{/* <Avatar avatar={undefined} username={user?.username} /> */}
				<textarea
					ref={inputRef}
					onKeyDown={handleKeyDown}
					className="h-5 scrollbar-hide resize-none bg-transparent min-w-0 outline-none rounded-lg px-4 text-gray-800 flex-grow"
					placeholder="Enter text here..."
				/>
				<button className="text-2xl w-6 mr-1 text-gray-500 aspect-square">
					<i className="uil uil-microphone"></i>
				</button>
				<button
					onClick={onSendMessage}
					className="text-sky-600 text-2xl w-8 aspect-square"
				>
					<i className="uil uil-message"></i>
				</button>
			</section>
		</section>
	);
};

interface ChatContentHeaderProps {
	groupDetail: IGroupDetail | undefined;
	openModal: (id: string) => void;
	user: IProfile;
}

const ChatContentHeader = ({
	user,
	openModal,
	groupDetail,
}: ChatContentHeaderProps) => {
	const currentChat = useChatListStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);

	if (!currentChat)
		return (
			<section className="border-b bg-white border-b-gray-100 flex items-center justify-between p-3">
				{EN_US['chat.NoInfo']}
			</section>
		);
	const memberNumber =
		currentChat.type === 'group' &&
		currentChat.members &&
		`${currentChat.members.length} ${
			currentChat.members.length > 1
				? EN_US['chat.Members']
				: EN_US['chat.Member']
		}`;

	const profile =
		currentChat.type === 'user'
			? currentChat.users?.find((u) => u._id !== user.id)
			: groupDetail;

	return (
		<header className="border-b bg-white border-b-gray-100 flex items-center justify-between p-3">
			<section className="flex items-center gap-3">
				<button onClick={() => setCurrentChat('')}>
					<i className="uil uil-angle-double-left text-3xl text-gray-600"></i>
				</button>
				<ListAvatar username={profile?.name} />
				<section
					className="flex flex-col cursor-pointer"
					onClick={() => openModal(CHAT_INFO_MODAL)}
				>
					<h2 className="text-gray-700 font-medium text-xl">{profile?.name}</h2>
					{memberNumber && (
						<span className="text-xs text-gray-400 font-medium">
							{memberNumber}
						</span>
					)}
				</section>
			</section>

			<button className="text-2xl md:text-3xl text-gray-500">
				<i className="uil uil-ellipsis-h"></i>
			</button>
		</header>
	);
};
