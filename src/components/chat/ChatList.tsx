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
				' lg:w-96 flex flex-col lg:border-r bg-white lg:border-r-slate-100'
			}
		>
			<header className="p-4 pb-0 flex items-center justify-between">
				<h1 className="text-2xl flex gap-3 items-center md:text-3xl font-medium text-gray-800">
					<i className="uil uil-comment text-blue-600 bg-sky-50 aspect-square w-9 md:w-11 grid place-items-center rounded-full"></i>
					<span>{EN_US['chat.Chats']}</span>
				</h1>
				<button
					onClick={toggleMenu}
					className="text-2xl md:text-3xl text-gray-500"
				>
					<i className="uil uil-ellipsis-h"></i>
				</button>
			</header>

			<section className="p-4">
				<SearchInput
					name="search"
					id="search"
					onChange={(e) => setSearch(e.target.value)}
					value={search}
					placeholder="Search..."
				/>
			</section>

			{!searchIsActive && (
				<>
					<ItemHeader
						icon="uil uil-comment-lines"
						message={EN_US['chat.AllMessages']}
					/>
					<ChatListItem onClick={onChatClick} chats={chatList} uid={uid} />
				</>
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
		<section className="px-4 py-2 text-gray-400 font-medium flex items-center gap-1.5">
			<i className={icon + ' text-xl font-bold'}></i>
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
				'flex flex-col overflow-scroll scrollbar-hide' +
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
				'p-4 border-b flex text-left items-center gap-3 border-b-gray-100 ' +
				(isActive ? 'text-sky-700 bg-sky-100' : 'text-gray-700 bg-white')
			}
		>
			<ListAvatar username={data.name} />
			<section className="flex-1">
				<h5 className="font-medium whitespace-nowrap">{data.name}</h5>
				<p className="text-sm opacity-70">
					<span className="font-bold">
						{data?.lastMessage?.sender._id === uid
							? 'You'
							: data?.lastMessage?.sender.name}{' '}
					</span>
					{shortenString(data?.lastMessage?.content ?? '')}
				</p>
			</section>
			<section className="flex flex-col justify-between">
				{!isSearch && (
					<span
						className={
							'justify-end text-xs ' +
							(isActive ? 'text-sky-500' : 'text-gray-400')
						}
					>
						{time}
					</span>
				)}
				{data.unseen > 0 &&(
					<span className="self-end text-white flex justify-center items-center text-center bg-sky-500 w-5 text-[0.65rem] rounded-full aspect-square">
						<span className="h-3.5">{data.unseen}</span>
					</span>
				)}
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
				'p-4 text-gray-700 border-b flex text-left items-center gap-3 border-b-gray-100 ' +
				(isActive ? 'text-sky-700 bg-sky-100' : 'text-gray-700 bg-white')
			}
		>
			<ListAvatar username={user?.username} />
			<section className="flex-1">
				<h5 className="font-medium">{user?.name}</h5>
				{!isSearch ? (
					<p className="text-sm opacity-70">
						<span className="font-bold">
							{data?.lastMessage?.sender._id === uid ? 'You' : user?.name}{' '}
						</span>
						{shortenString(data?.lastMessage?.content ?? '')}
					</p>
				) : (
					<p className="text-sm">{shortenString(user?.username)}</p>
				)}
			</section>
			<section className="flex flex-col justify-between">
				{!isSearch && (
					<span
						className={
							'justify-end text-xs ' +
							(isActive ? 'text-sky-500' : 'text-gray-400')
						}
					>
						{time}
					</span>
				)}
				{data.unseen > 0 && (
					<span className="self-end text-white flex justify-center items-center text-center bg-sky-500 w-5 text-[0.65rem] rounded-full aspect-square">
						<span className='h-3.5'>
						{data.unseen}
						</span>
					</span>
				)}
			</section>
		</button>
	);
};
