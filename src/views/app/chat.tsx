import { ChatContent, ChatList } from 'components/chat';
import { SideMenu } from 'components/partials';
import {
	useGetUserConversation,
	useGetUserGroup,
	useGetUserProfile,
} from 'hooks';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore, useChatStore } from 'store';

const Chat = () => {
	const token = useAuthStore(state => state.token);
	const navigate = useNavigate();
	const currentChat = useChatStore((state) => state.currentChat);
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

	const { data: groups, isLoading: isGroupLoading,refetch } = useGetUserGroup();
	const { data: chats, isLoading: isChatLoading } = useGetUserConversation();

	const markedGroups = groups?.map((item) => ({ ...item, type: 'group' }));
	const markedConversations = chats?.map((item) => ({
		...item,
		type: 'user',
	}));

	useEffect(() => {
		refetch();
	}, [currentChat])

	useEffect(() => {
		if (isLoading) return;
		const disconnect = initSocket(userData.id);
		return () => {
			// remove all subscriptions in the collection
			disconnect();
		};
	}, [userData?.id]);

	if (isChatLoading || isGroupLoading) return <div>Loading...</div>;
	if (!token || !markedGroups || !markedConversations)
		return <Navigate to="/login" />;
	
	// TODO: change so that it sorts by last message
	const combined = [...markedGroups, ...markedConversations];

	return (
		<main className="flex flex-row w-screen h-screen overflow-hidden">
			<ChatList uid={userData?.id} combined={combined} />
			<ChatContent user={userData} />
			<SideMenu user={userData} />
		</main>
	);
};

export default Chat;
