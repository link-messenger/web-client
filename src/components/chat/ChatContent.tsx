import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Card, Modal, SquareButton } from '../core';
import { Avatar, GroupProfileModal, ListAvatar, MessageBox } from '../partials';
import {
	CHAT_INFO_MODAL,
	MESSAGE_INITIALS,
	SEND_MESSAGE_VALIDATION,
} from 'constants';
import { EN_US } from 'languages';
import { useChatStore } from 'store';
import { useChatScroll, useModal } from 'hooks';
import { useEffect, useState } from 'react';
import { MessageTypes } from 'store';
import { IProfile } from 'interfaces';

type MsgType = typeof MESSAGE_INITIALS;

export const ChatContent = ({ user }: { user: IProfile }) => {
	const { currentId, openModal, closeModal } = useModal();
	const currentChat = useChatStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);
	const chats = useChatStore((state) => state.currentMessages);
	const loadChat = useChatStore((state) => state.loadChat);
	const messageConfirmListener = useChatStore(
		(state) => state.messageConfirmListener
	);
	const sendMessage = useChatStore((state) => state.sendMessage);
	const ref = useChatScroll(chats);

	useEffect(() => {
		if (!currentChat) return;
		loadChat();
		const clearConfirmListener = messageConfirmListener();
		return () => {
			clearConfirmListener && clearConfirmListener();
		};
	}, [currentChat]);
	const [mType, setMType] = useState<MessageTypes>('MESSAGE');

	if (!currentChat)
		return (
			<section className="w-0 hidden flex-grow lg:grid place-items-center text-slate-400 text-xl">
				{EN_US['chat.SelectChat']}
			</section>
		);

	const memberNumber =
		currentChat.type === 'group' &&
		`${currentChat.members.length} ${
			currentChat.members.length > 1
				? EN_US['chat.Members']
				: EN_US['chat.Member']
		}`;
	const onSendMessage = (
		{ content }: MsgType,
		{ resetForm }: FormikHelpers<MsgType>
	) => {
		const to =
			currentChat.type === 'user' ? currentChat.members[0] : currentChat.id;
		sendMessage({
			content,
			to,
			type: mType,
			model: currentChat.type,
		});
		resetForm();
	};

	return (
		<section className="flex flex-col flex-grow h-full overflow-hidden">
			<header className="border-b border-b-gray-100 flex items-center justify-between p-3">
				<section className="flex items-center gap-3">
					<button onClick={() => setCurrentChat(null)}>
						<i className="uil uil-angle-double-left text-3xl text-gray-600"></i>
					</button>
					<ListAvatar username={currentChat.name} />
					<section
						className="flex flex-col cursor-pointer"
						onClick={() => openModal(CHAT_INFO_MODAL)}
					>
						<h2 className="text-gray-700 font-medium text-xl">
							{currentChat.name}
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
				className="bg-gray-50 p-4 scrollbar-hide flex-grow flex flex-col gap-3 overflow-auto w-full"
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
				<Form className="w-full h-16 gap-2 p-2 lg:p-4 md:h-20 border-t border-gray-100 flex items-center justify-between">
					<Avatar avatar={undefined} username={user.username} />
					<Field
						autoFocus
						type="text"
						name="content"
						className="h-12 bg-gray-50 min-w-0 outline-none rounded-lg px-4 text-gray-800 flex-grow"
						placeholder="Enter text here..."
						autoComplete="off"
					/>
					<SquareButton
						type="submit"
						className="w-12  bg-blue-500 text-white text-xl"
					>
						<i className="uil uil-message"></i>
					</SquareButton>
				</Form>
			</Formik>

			{memberNumber && <GroupProfileModal currentId={currentId} closeModal={closeModal} />}
		</section>
	);
};
