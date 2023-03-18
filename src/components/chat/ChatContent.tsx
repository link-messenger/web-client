import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Card, Modal, SquareButton } from '../core';
import {
	Avatar,
	GroupProfileEditModal,
	GroupProfileModal,
	ListAvatar,
	MessageBox,
} from '../partials';
import {
	CHAT_INFO_MODAL,
	MESSAGE_INITIALS,
	SEND_MESSAGE_VALIDATION,
} from 'constants';
import { EN_US } from 'languages';
import { useChatListStore, useChatStore } from 'store';
import { useChatScroll, useGetUserGroupDetail, useModal } from 'hooks';
import { useEffect, useState } from 'react';
import { MessageTypes } from 'store';
import { IProfile } from 'interfaces';
import { Categories } from 'api';

type MsgType = typeof MESSAGE_INITIALS;

export const ChatContent = ({ user }: { user: IProfile }) => {
	const [mType, setMType] = useState<MessageTypes>('MESSAGE');
	const { currentId, openModal, closeModal } = useModal();
	const currentChatId = useChatStore((state) => state.currentChat);
	const currentChat = useChatListStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);
	const chats = useChatStore((state) => state.currentMessages);
	const loadChat = useChatStore((state) => state.loadChat);
	const messageConfirmListener = useChatStore(
		(state) => state.messageConfirmListener
	);

	const { data: groupDetail, refetch } = useGetUserGroupDetail(
		currentChatId,
		currentChat?.type as Categories
	);
	const sendMessage = useChatStore((state) => state.sendMessage);
	const ref = useChatScroll(chats);

	useEffect(() => {
		if (!currentChatId) return;
		loadChat(currentChat);
		const clearConfirmListener = messageConfirmListener();
		return () => {
			clearConfirmListener && clearConfirmListener();
		};
	}, [currentChatId]);

	if (!currentChatId || !currentChat)
		return (
			<section className="chat-bg-1 bg-gray-50 relative w-0 hidden flex-grow lg:grid place-items-center text-sky-500 text-xl"></section>
		);

	const memberNumber =
		currentChat.type === 'group' &&
		currentChat.members &&
		`${currentChat.members.length} ${
			currentChat.members.length > 1
				? EN_US['chat.Members']
				: EN_US['chat.Member']
		}`;

	const to =
		currentChat.type === 'user'
			? currentChat.users?.find((u) => u._id !== user.id)?._id
			: currentChatId;
	const onSendMessage = (
		{ content }: MsgType,
		{ resetForm }: FormikHelpers<MsgType>
	) => {
		sendMessage({
			content,
			to: to as string,
			type: mType,
			model: currentChat.type as Categories,
		});
		resetForm();
	};

	const profile =
		currentChat.type === 'user'
			? currentChat.users?.find((u) => u._id !== user.id)
			: groupDetail;

	return (
		<section className=" flex flex-col flex-grow h-full overflow-hidden will-change-contents">
			<header className="border-b border-b-gray-100 flex items-center justify-between p-3">
				<section className="flex items-center gap-3">
					<button onClick={() => setCurrentChat('')}>
						<i className="uil uil-angle-double-left text-3xl text-gray-600"></i>
					</button>
					<ListAvatar username={profile?.name} />
					<section
						className="flex flex-col cursor-pointer"
						onClick={() => openModal(CHAT_INFO_MODAL)}
					>
						<h2 className="text-gray-700 font-medium text-xl">
							{profile?.name}
						</h2>
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

			<div
				ref={ref}
				className="chat-bg-1 will-change-scroll bg-gray-50 p-4 scrollbar-hide flex-grow flex flex-col-reverse gap-3 overflow-auto w-full"
			>
				{chats.map(({ content, createdAt, sender, _id }) => (
					<MessageBox
						key={_id}
						content={content}
						created={createdAt}
						uid={user.id}
						user={{
							id: sender._id,
							username: sender.username,
						}}
					/>
				))}
			</div>
			<Formik
				initialValues={MESSAGE_INITIALS}
				validateOnChange={false}
				validateOnBlur={false}
				validationSchema={SEND_MESSAGE_VALIDATION}
				onSubmit={onSendMessage}
			>
				<Form className="w-full h-16 gap-2 p-2 lg:p-4 lg:h-20 border-t border-gray-100">
					<section className="bg-gray-50 flex items-center justify-between rounded-lg">
						{/* <Avatar avatar={undefined} username={user?.username} /> */}
						<Field
							autoFocus
							type="text"
							name="content"
							className="h-12 bg-transparent min-w-0 outline-none rounded-lg px-4 text-gray-800 flex-grow"
							placeholder="Enter text here..."
							autoComplete="off"
						/>
						<button className='text-2xl w-8 mr-1 text-gray-500 aspect-square'>
							<i className="uil uil-microphone"></i>
						</button>
						<button
							type="submit"
							className="text-sky-600 text-2xl w-12 aspect-square"
						>
							<i className="uil uil-message"></i>
						</button>
					</section>
				</Form>
			</Formik>

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
		</section>
	);
};
