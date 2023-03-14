import { ChatContent, ChatList } from 'components/chat';
import { SideMenu } from 'components/partials';
import {
	useGetUserConversation,
	useGetUserGroup,
	useGetUserProfile,
} from 'hooks';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore, useChatListStore, useChatStore } from 'store';
import { combine } from 'zustand/middleware';

const Chat = () => {
	const initSocket = useChatStore((state) => state.initSocket);
	const setMessageListener = useChatStore((state) => state.setMessageListener);
	const setChats = useChatListStore(state => state.setChats);

	const { data: userData, isLoading } = useGetUserProfile();

	const { data: groups, isLoading: isGroupLoading } = useGetUserGroup();
	const { data: convs, isLoading: isConvLoading } = useGetUserConversation();

	useEffect(() => {
		if (isLoading) return;
		const disconnect = initSocket(userData.id);
		const clearListener = setMessageListener();
		return () => {
			// remove all subscriptions in the collection
			disconnect();
			clearListener && clearListener();
		};
	}, [userData?.id]);

	useEffect(() => {
		if (!groups || !convs) return;
		setChats(groups, convs);
	}, [isConvLoading, isGroupLoading]);
	console.log()

	return (
		<main className="flex flex-row w-screen h-screen overflow-hidden">
			<ChatList uid={userData?.id} />
			<ChatContent user={userData} />
			<SideMenu user={userData} />
		</main>
	);
};

export default Chat;
