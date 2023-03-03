import { pb } from 'api';
import { SquareButton } from 'components';
import { Avatar, MessageBox } from 'components/partials';
import { MESSAGE_INITIALS, SEND_MESSAGE_VALIDATION } from 'constants';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useGetUserProfile, useSendChat } from 'hooks';
import { useChatScroll } from 'hooks/useScroll';
import { EN_US } from 'languages';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from 'store/useChatStore';

const Chat = () => {
	const navigate = useNavigate();
	const chats = useChatStore((state) => state.messages);
	const addMessage = useChatStore((state) => state.addMessage);
	const loadChat = useChatStore((state) => state.loadChat);

	const { data: userData, isLoading } = useGetUserProfile({
		onError: () => {
			navigate('/login', {
				state: {
					from: '/chat'
				}
			});
		},
	});

	useEffect(() => {
		loadChat();
	}, []);


	useEffect(() => {
		pb.collection('messages').subscribe('*', (e) => {
			addMessage({
				user: e.record.user,
				content: e.record.content,
				created: e.record.created,
			});
		});
		return () => {
			// remove all subscriptions in the collection
			pb.collection('messages').unsubscribe('*');
		};
	}, []);
	
	
	
	const { mutateAsync: sendMessage } = useSendChat();
	const onSendMessage = (
		data: typeof MESSAGE_INITIALS,
		{ resetForm }: FormikHelpers<typeof MESSAGE_INITIALS>
	) => {
		sendMessage(data).then(() => resetForm());
	};

	const ref = useChatScroll(chats);

	const avatar = `${import.meta.env.VITE_FILE_API_URL}/${
		userData?.collectionId
	}/${userData?.id}/${userData?.avatar}`;
	const uid = userData?.id ?? '';
	return (
		<main className="p-4 flex flex-col w-screen h-screen overflow-hidden">
			<header className="flex items-center justify-between pb-4 ">
				<h1 className="text-2xl flex gap-3 items-center md:text-3xl font-medium text-gray-800">
					<i className="uil uil-comment text-blue-600 bg-sky-50 aspect-square w-9 md:w-11 grid place-items-center rounded-full"></i>
					<span>{EN_US['chat.Messages']}</span>
				</h1>
				<button className="text-2xl md:text-3xl text-gray-500">
					<i className="uil uil-ellipsis-h"></i>
				</button>
			</header>

			<div ref={ref} className="scrollbar-hide flex-grow flex flex-col gap-3 overflow-auto w-full">
				{chats.map(({ content, created, user }, index) => (
					<MessageBox
						key={`chat-${index}`}
						content={content}
						created={created}
						uid={uid}
						user={user}
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
				<Form className="w-full h-16 gap-2 pt-4 md:h-20 border-t flex items-center justify-between">
					<Avatar
						avatar={userData?.avatar ? avatar : undefined}
						username={userData?.username}
					/>
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
		</main>
	);
};

export default Chat;
