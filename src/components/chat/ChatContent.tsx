import { KeyboardEvent, useRef, useState } from 'react';
import { motion, Variants } from 'framer-motion';

import { GroupProfileEditModal, GroupProfileModal, Avatar } from '../partials';
import { CHAT_INFO_MODAL } from 'constants';
import { EN_US } from 'languages';
import { useChatListStore, useChatStore, MessageTypes } from 'store';
import { useGetUserGroupDetail, useModal } from 'hooks';
import { IGroupDetail, IProfile } from 'interfaces';
import { Categories } from 'api';
import { ChatBox } from './ChatBox';

const chatContentVariant: Variants = {
	hidden: {
		x: 300,
		opacity: 0,
	},
	visible: {
		display: 'flex',
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.2,
			ease: 'linear',
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
	if (!currentChatId)
		return (
			<section className="h-full hidden lg:flex flex-grow text-gray-600 dark:text-neutral-300 text-center  flex-col gap-4 justify-center items-center">
				<section className="text-7xl p-4 bg-opacity-20 text-primary bg-primary rounded-full">
					<i className="uil uil-bolt-alt"></i>
				</section>
				<h3 className="text-3xl font-medium ">
					{EN_US['chat.EmptyContentHeader']}
				</h3>
				<p className="font-light text-sm text-neutral-500 dark:text-neutral-400">
					{EN_US['chat.EmptyContentExpl1']}
					<br />
					{EN_US['chat.EmptyContentExpl2']}
				</p>
			</section>
		);

	return (
		<motion.section
			variants={chatContentVariant}
			initial="hidden"
			animate={currentChatId ? 'visible' : 'hidden'}
			className="flex-col flex-grow h-full overflow-hidden will-change-contents"
		>
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
				inputRef.current.style.height = `${lineRef.current * 23}px`;
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
					inputRef.current.style.height = `${lineRef.current * 23}px`;
				}
			}
		}
	};

	return (
		<section className="w-full gap-2 p-2 lg:p-4 border-t bg-light-light-back-gray dark:bg-dark-light-gray dark:border-dark-content-gray border-light-border-gray">
			<section className="bg-white dark:bg-dark-content-gray p-2 flex items-center justify-between gap-0.5 rounded-lg">
				{/* <Avatar avatar={undefined} username={user?.username} /> */}
				<textarea
					ref={inputRef}
					onKeyDown={handleKeyDown}
					className="h-5 scrollbar-hide resize-none bg-transparent min-w-0 outline-none rounded-lg px-4 text-gray-800 dark:text-neutral-200 placeholder:text-gray-500 placeholder:dark:text-neutral-500 placeholder:text-sm leading-5 flex-grow"
					placeholder="Type your message..."
				/>
				<button className="text-2xl w-6 mr-1 text-neutral-400 aspect-square">
					<i className="uil uil-microphone"></i>
				</button>
				<button
					onClick={onSendMessage}
					className="text-primary text-2xl w-8 aspect-square"
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
			<section className="backdrop-blur-xl bg-opacity-60 border border-gray-200 border-b dark:text-neutral-200 bg-light-light-back-gray dark:bg-dark-light-gray dark:border-b-dark-content-gray border-b-gray-100 flex items-center justify-between p-3">
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
		<header className="gap-4 p-3 border-b text-gray-600 dark:text-neutral-200 dark:bg-dark-light-gray dark:border-b-dark-content-gray bg-light-light-gray border-b-light-border-gray flex items-center">
			<button onClick={() => setCurrentChat('')}>
				<i className="uil uil-angle-double-left text-3xl"></i>
			</button>
			<Avatar size="w-12" username={profile?.name} />
			<section
				className="flex flex-col cursor-pointer flex-grow whitespace-nowrap"
				onClick={() => {
					if (currentChat.type === 'group') openModal(CHAT_INFO_MODAL);
				}}
			>
				<h2 className="font-medium text-xl">{profile?.name}</h2>
				<span className="text-xs text-gray-400 font-medium capitalize">
					{currentChat.type === 'group' ? memberNumber : currentChat.status}
				</span>
			</section>

			<button className="text-lg dark:text-neutral-300 text-gray-600">
				<i className="uil uil-search"></i>
			</button>
			<button className="hidden sm:block text-xl dark:text-neutral-300 text-gray-600">
				<i className="uil uil-phone-volume"></i>
			</button>
			<button className="hidden sm:block text-2xl dark:text-neutral-300 text-gray-600">
				<i className="uil uil-video"></i>
			</button>
			<button className="text-xl dark:text-neutral-300 text-gray-600">
				<i className="uil uil-ellipsis-v"></i>
			</button>
		</header>
	);
};
