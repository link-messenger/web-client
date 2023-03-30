import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


import { ChatContent } from '../chat';
import { useGetUserProfile } from 'hooks';
import { useChatListStore, useChatStore } from 'store';


export const ChatLayout = () => {
  const initSocket = useChatStore((state) => state.initSocket);
	const setMessageListener = useChatStore((state) => state.setMessageListener);
	const setJoinConfirmListener = useChatListStore(
		(state) => state.setJoinConfirmListener
	);
	const setJoinListener = useChatListStore((state) => state.setJoinListener);
	const setLeaveListener = useChatListStore((state) => state.setLeaveListener);
	const setLeaveConfirmListener = useChatListStore(
		(state) => state.setLeaveConfirmListener
	);

	const { data: userData, isLoading } = useGetUserProfile();

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
  return (
		<main className="chat-bg-1 dark:bg-dark-light-gray flex flex-row h-screen w-screen overflow-hidden">
      <Outlet />
      <ChatContent user={userData} />
		</main>
	);
}
