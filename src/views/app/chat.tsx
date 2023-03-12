import { ChatContent, ChatList } from 'components/chat';
import {
	useGetUserConversation,
	useGetUserGroup,
	useGetUserProfile,
} from 'hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useChatStore } from 'store';

const Chat = () => {
	const navigate = useNavigate();
	const initSocket = useChatStore((state) => state.initSocket);
	const clearAll = useAuthStore((state) => state.clearAll);
	const { data: userData, isLoading } = useGetUserProfile({
		onError: () => {
			clearAll();
			navigate('/login', {
				state: {
					from: '/chat',
				},
			});
		},
	});

	const { data: groups, isLoading: isGroupLoading } = useGetUserGroup();
	const { data: chats, isLoading: isChatLoading } = useGetUserConversation();

	const markedGroups = groups?.map((item) => ({ ...item, type: 'group' }));
	const markedConversations = chats?.map((item) => ({
		...item,
		type: 'user',
	}));

	useEffect(() => {
		if (isLoading) return;
		const disconnect = initSocket(userData.id);
		return () => {
			// remove all subscriptions in the collection
			disconnect();
		};
	}, [userData?.id]);

	if (isChatLoading || isGroupLoading) return <div>Loading...</div>;
	if (!markedGroups || !markedConversations) return <div>Something went wrong</div>;
	// TODO: change so that it sorts by last message
	const combined = [...markedGroups, ...markedConversations];
	return (
		<main className="flex flex-row w-screen h-screen overflow-hidden">
			<ChatList uid={userData?.id} combined={combined} />
			<ChatContent user={userData} />
		</main>
	);
};

export default Chat;
