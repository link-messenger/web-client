import { useEffect, useState } from 'react';

import {
	useCreateUserConversation,
	useDebounce,
	useSearchChat,
	useGetUserChatList,
} from 'hooks';
import { SearchInput } from '../core';
import { IChat } from 'interfaces';
import { EN_US } from 'languages';
import { useChatListStore, useChatStore, useMenuStore } from 'store';
import { ListAvatar } from 'components/partials';
import { shortenString } from 'utils/str';
import { formatTime } from 'utils/time';

export const ChatList = ({ uid }: { uid: string }) => {
	const chatList = useChatListStore((state) => state.chats);
	const toggleMenu = useMenuStore((state) => state.toggle);
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);
	const { data: searchedResult } = useSearchChat(debouncedSearch);

	const setChats = useChatListStore((state) => state.setChats);
	const reloadChat = useChatListStore((state) => state.reloadChat);
	const {
		data: chats,
		isLoading: isChatsLoading,
		refetch,
	} = useGetUserChatList();

	useEffect(() => {
		if (!chats) return;
		setChats(chats);
		if (reloadChat) {
			refetch();
		}
	}, [isChatsLoading, reloadChat]);

	const currentChatId = useChatStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);

	const onChatClick = (id: string) => setCurrentChat(id);
	const searchIsActive = search.length > 2;
	return (
		<section
			className={
				(currentChatId ? 'w-0  max-lg:hidden' : 'w-full') +
				' lg:w-[345px] flex flex-col lg:border-r bg-white py-6 px-3.5 gap-5 dark:bg-dark-gray dark:border-0  lg:border-r-slate-100'
			}
		>
			<header className="text-xl dark:text-gray-400 font-medium">
				{EN_US['chat.Chats']}
			</header>
			<SearchInput
				name="search"
				id="search"
				onChange={(e) => setSearch(e.target.value)}
				value={search}
				placeholder="Search here..."
			/>

			{!searchIsActive && (
				<section className="space-y-3">
					<ItemHeader
						icon="uil uil-comment-alt-lines"
						message={EN_US['chat.AllMessages']}
					/>
					<ChatListItem onClick={onChatClick} chats={chatList} uid={uid} />
				</section>
			)}

			{searchIsActive && (
				<SearchList
					setSearch={setSearch}
					searchedResult={searchedResult}
					uid={uid}
				/>
			)}
		</section>
	);
};

const ItemHeader = ({ icon, message }: { icon: string; message: string }) => {
	return (
		<section className="text-neutral-400 uppercase text-sm gap-2 flex items-center">
			<i className={'text-base ' + icon} />
			{message}
		</section>
	);
};

const SearchList = ({ setSearch, searchedResult, uid }: any) => {
	const joinGroup = useChatListStore((state) => state.joinGroup);
	const addConv = useChatListStore((state) => state.addConv);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);
	const { mutateAsync: createConv } = useCreateUserConversation();
	const onGroupClick = (id: string) => {
		if (!id) return;
		setSearch('');
		joinGroup(id);
	};

	const onConversationClick = (id: string) => {
		if (!id) return;
		createConv({
			targetUser: id,
		}).then((res) => {
			setSearch('');
			addConv(res);
			setCurrentChat(res._id);
		});
	};
	return (
		<>
			<ItemHeader icon="uil uil-comment-share" message={EN_US['chat.Groups']} />
			{searchedResult?.groups?.length ? (
				<ChatListItem
					isSearch={true}
					onClick={onGroupClick}
					chats={searchedResult.groups}
					uid={uid}
				/>
			) : (
				<p className="text-center text-gray-400 font-medium">
					{EN_US['chat.NoGroupFound']}
				</p>
			)}

			<ItemHeader icon="uil uil-comments" message={EN_US['chat.Chats']} />
			{searchedResult?.users?.length ? (
				<ChatListItem
					isSearch={true}
					onClick={onConversationClick}
					chats={searchedResult.users}
					uid={uid}
				/>
			) : (
				<p className="text-center text-gray-400 font-medium">
					{EN_US['chat.NoUserFound']}
				</p>
			)}
		</>
	);
};

export const ChatListItem = ({
	chats,
	uid,
	onClick,
	isSearch = false,
}: {
	chats: any[] | null;
	uid: string;
	onClick: Function;
	isSearch?: boolean;
}) => {
	if (!chats || !chats.length) {
		return (
			<section className="grid place-items-center h-full font-bold text-lg text-gray-400">
				{EN_US['chat.ChatEmpty']}
			</section>
		);
	}
	return (
		<section
			className={
				'flex flex-col gap-1 overflow-scroll scrollbar-hide' +
				(isSearch ? '' : ' flex-grow')
			}
		>
			{chats.map((item) => (
				<ChatItem
					key={item._id}
					onClick={onClick}
					isSearch={isSearch}
					item={item}
					uid={uid}
				/>
			))}
		</section>
	);
};
export const ChatItem = ({
	item,
	uid,
	onClick,
	isSearch,
}: {
	onClick: Function;
	item: any;
	uid: string;
	isSearch: boolean;
}) => {
	switch (item.type) {
		case 'group':
			return (
				<GroupItem
					uid={uid}
					data={item}
					isSearch={isSearch}
					onClick={onClick}
				/>
			);
		case 'user':
			return (
				<ConversationItem
					data={item}
					uid={uid}
					isSearch={isSearch}
					onClick={onClick}
				/>
			);
		default:
			return <section>{EN_US['chat.ItemNotExist']}</section>;
	}
};

export const GroupItem = ({
	isSearch,
	data,
	onClick,
	uid,
}: {
	onClick: any;
	isSearch: boolean;
	data: IChat;
	uid: string;
}) => {
	const time = formatTime(data?.lastMessage?.createdAt ?? data.updatedAt);
	const current = useChatStore((state) => state.currentChat);
	const isActive = current === data._id && !isSearch;
	return (
		<button
			onClick={() => onClick(data._id)}
			className={
				'dark:text-gray-100 p-3 rounded-md transition-colors hover:dark:bg-opacity-20 hover:dark:bg-primary-light flex text-left items-center gap-3 ' +
				(isActive
					? 'bg-primary-light bg-opacity-20'
					: 'text-gray-700 bg-white dark:bg-dark-gray')
			}
		>
			<ListAvatar username={data.name} />
			<section className="flex-1">
				<h5 className="font-medium whitespace-nowrap flex justify-between items-center">
					<span>{data.name}</span>
					{!isSearch && (
						<span className={'text-xs text-neutral-500'}>{time}</span>
					)}
				</h5>
				<section className="text-sm flex gap-3 items-center opacity-70">
					<p className="flex-grow whitespace-nowrap">
						<span className="font-bold">
							{data?.lastMessage?.sender._id === uid
								? 'You'
								: data?.lastMessage?.sender.name}
						</span>{' '}
						{shortenString(data?.lastMessage?.content ?? '', 18)}
					</p>
					{data.unseen > 0 && (
						<span className="text-white text-center leading-3 bg-primary bg-opacity-50 px-1 py-0.5 text-xs rounded-md">
							{data.unseen}
						</span>
					)}
				</section>
			</section>
		</button>
	);
};

export const ConversationItem = ({
	isSearch,
	data,
	uid,
	onClick,
}: {
	isSearch: boolean;
	onClick: any;
	data: any;
	uid: string;
}) => {
	const user = isSearch
		? data
		: data.users.filter((u: any) => u._id !== uid)[0];
	const time = formatTime(data?.lastMessage?.createdAt ?? data.createdAt);
	const current = useChatStore((state) => state.currentChat);
	const isActive = !isSearch && current === data._id;
	return (
		<button
			onClick={() => onClick(data._id)}
			className={
				'dark:text-gray-100 p-3 rounded-md transition-colors hover:dark:bg-opacity-20 hover:dark:bg-primary-light flex text-left items-center gap-3 ' +
				(isActive
					? 'bg-primary-light bg-opacity-20'
					: 'text-gray-700 bg-white dark:bg-dark-gray')
			}
		>
			<ListAvatar username={user?.username} />
			<section className="flex-1">
				<h5 className="font-medium whitespace-nowrap flex justify-between items-center">
					<span>{user.name}</span>
					{!isSearch && (
						<span className={'text-xs text-neutral-500'}>{time}</span>
					)}
				</h5>
				<section className="text-sm flex gap-3 items-center opacity-70">
					<p className="flex-grow whitespace-nowrap">
						<span className="font-bold">
							{data?.lastMessage?.sender._id === uid
								? 'You'
								: data?.lastMessage?.sender.name}
						</span>{' '}
						{shortenString(data?.lastMessage?.content ?? '', 15)}
					</p>
					{data.unseen > 0 && (
						<span className="text-white text-center leading-3 bg-primary bg-opacity-50 px-1 py-0.5 text-xs rounded-md">
							{data.unseen}
						</span>
					)}
				</section>
			</section>
		</button>
	);
};
