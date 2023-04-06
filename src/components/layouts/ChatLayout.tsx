import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';


import { ChatContent } from '../chat';
import { useGetUserProfile } from 'hooks';
import { useChatListStore, useChatStore } from 'store';
import Loading from 'views/app/loading';


export const ChatLayout = () => {
  const initSocket = useChatStore((state) => state.initSocket);
	const setMessageListener = useChatStore((state) => state.setMessageListener);
	const setJoinConfirmListener = useChatListStore(
		(state) => state.setJoinConfirmListener
	);
	const setJoinListener = useChatListStore((state) => state.setJoinListener);
	const setStatusListener = useChatListStore((state) => state.setStatusListener);
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
		const clearStatusListener = setStatusListener();
		const clearJoinListener = setJoinListener();
		const clearLeaveConfirmListener = setLeaveConfirmListener();
		const clearLeaveListener = setLeaveListener();
		return () => {
			// remove all subscriptions in the collection
			disconnect();
			clearMessageListener && clearMessageListener();
			clearJoinConfirmListener && clearJoinConfirmListener();
			clearJoinListener && clearJoinListener();
			clearStatusListener && clearStatusListener();
			clearLeaveListener && clearLeaveListener();
			clearLeaveConfirmListener && clearLeaveConfirmListener();
		};
	}, [userData?.id]);


	if (isLoading) {
		return <Loading />
	}

  return (
			<main className="chat-bg-1 bg-neutral-50 dark:bg-dark-light-gray flex flex-row h-screen w-screen overflow-hidden">
				<Outlet />
				<ChatContent user={userData} />
			</main>
	);
}
