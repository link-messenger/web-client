import { ChatContent, ChatList } from 'components/chat';
import { SideMenu } from 'components/partials';
import {
	useGetUserConversation,
	useGetUserGroup,
	useGetUserProfile,
} from 'hooks';
import { useEffect } from 'react';
import { useChatListStore, useChatStore } from 'store';

const Chat = () => {
	const initSocket = useChatStore((state) => state.initSocket);
	const setMessageListener = useChatStore((state) => state.setMessageListener);
	const setJoinConfirmListener = useChatListStore((state) => state.setJoinConfirmListener);
	const setJoinListener = useChatListStore((state) => state.setJoinListener);
	const setLeaveListener = useChatListStore((state) => state.setLeaveListener);
	const setLeaveConfirmListener = useChatListStore((state) => state.setLeaveConfirmListener);
	const setChats = useChatListStore(state => state.setChats);

	const { data: userData, isLoading } = useGetUserProfile();

	const { data: groups, isLoading: isGroupLoading } = useGetUserGroup();
	const { data: convs, isLoading: isConvLoading } = useGetUserConversation();

	useEffect(() => {
		if (isLoading) return;
		const disconnect = initSocket(userData.id);
		const clearMessageListener = setMessageListener();
		const clearJoinConfirmListener = setJoinConfirmListener();
		const clearJoinListener = setJoinListener();
		const clearLeaveConfirmListener = setLeaveConfirmListener();
		const clearLeaveListener = setLeaveListener();
		return () => {
			// remove all subscriptions in the collection
			disconnect();
			clearMessageListener && clearMessageListener();
			clearJoinConfirmListener && clearJoinConfirmListener();
			clearJoinListener && clearJoinListener();
			clearLeaveListener && clearLeaveListener();
			clearLeaveConfirmListener && clearLeaveConfirmListener();
		};
	}, [userData?.id]);

	useEffect(() => {
		if (!groups || !convs) return;
		setChats(groups, convs);
	}, [isConvLoading, isGroupLoading]);

	return (
		<main className="flex flex-row w-screen h-screen overflow-hidden">
			<ChatList uid={userData?.id} />
			<ChatContent user={userData} />
			<SideMenu user={userData} />
		</main>
	);
};

export default Chat;
