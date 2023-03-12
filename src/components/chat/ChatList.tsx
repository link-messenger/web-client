import { useDebounce, useSearchChat } from 'hooks';
import { SearchInput } from '../core';
import { IConversation, IGroup, IUser } from 'interfaces';
import { EN_US } from 'languages';
import { useChatStore } from 'store';
import { ListAvatar } from 'components/partials';
import { shortenString, usernameShorter } from 'utils/str';
import { formatTime } from 'utils/time';
import { useFormik } from 'formik';
import { useState } from 'react';

export const ChatList = ({
	combined,
	uid,
}: {
	combined?: any[];
	uid: string;
}) => {
	// const { mutate} =
	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 1000);
	const {
		data: searchedResult,
		isRefetching,
		isLoading,
		isFetching,
	} = useSearchChat(debouncedSearch);
	if (!combined || !combined.length)
		return <section className="">{EN_US['chat.ChatEmpty']}</section>;
	const currentChat = useChatStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);

	const onChatClick = (item: any, members: string[]) =>
		setCurrentChat({
			id: item._id,
			type: item.type,
			name: item.name,
			members: members,
		});
	const searchIsActive = search.length > 2;
	const isSearchLoading = isRefetching || isLoading || isFetching;
	return (
		<section
			className={
				(currentChat ? 'w-0  max-lg:hidden' : 'w-full') +
				' lg:w-96 p-4 flex flex-col gap-4 lg:border-r lg:border-r-slate-100'
			}
		>
			<header>
				<h1 className="text-2xl flex gap-3 items-center md:text-3xl font-medium text-gray-800">
					<i className="uil uil-comment text-blue-600 bg-sky-50 aspect-square w-9 md:w-11 grid place-items-center rounded-full"></i>
					<span>{EN_US['chat.Chats']}</span>
				</h1>
			</header>

			<SearchInput
				name="search"
				id="search"
				onChange={(e) => setSearch(e.target.value)}
				value={search}
				placeholder="Search..."
			/>

			{!searchIsActive && (
				<>
					<section className="text-gray-400 font-medium flex items-center gap-1.5">
						<i className="uil uil-comment-alt-message text-xl font-bold"></i>
						{EN_US['chat.AllMessages']}
					</section>
					<ChatListItem onClick={onChatClick} chats={combined} uid={uid} />
				</>
			)}

			{searchIsActive &&
				(!isSearchLoading ? (
					<>
						<section className="text-gray-400 font-medium flex items-center gap-1.5">
							<i className="uil uil-comment-alt-message text-xl font-bold"></i>
							{EN_US['chat.Groups']}
						</section>
						{searchedResult?.groups?.length ? (
							<ChatListItem
								isSearch={true}
								onClick={onChatClick}
								chats={searchedResult.groups}
								uid={uid}
							/>
						) : (
							<p className="text-center text-gray-400 font-medium">
								{EN_US['chat.NoGroupFound']}
							</p>
						)}

						<section className="text-gray-400 font-medium flex items-center gap-1.5">
							<i className="uil uil-comment-alt-message text-xl font-bold"></i>
							{EN_US['chat.Chats']}
						</section>

						{searchedResult?.users?.length ? (
							<ChatListItem
								isSearch={true}
								onClick={onChatClick}
								chats={searchedResult.users}
								uid={uid}
							/>
						) : (
							<p className="text-center text-gray-400 font-medium">
								{EN_US['chat.NoUserFound']}
							</p>
						)}
					</>
				) : (
					<section className="flex-1 text-center grid place-items-center text-xl text-gray-400 font-medium">
						{EN_US['chat.Searching']}
					</section>
				))}
		</section>
	);
};

export const ChatListItem = ({
	chats,
	uid,
	onClick,
	isSearch = false,
}: {
	chats: any[];
	uid: string;
	onClick: Function;
	isSearch?: boolean;
}) => {
	return (
		<section
			className={
				'flex flex-col overflow-scroll scrollbar-hide gap-2' +
				(isSearch ? '' : ' flex-grow')
			}
		>
			{chats.map((item) => (
				<ChatItem key={item._id} onClick={onClick} isSearch={isSearch} item={item} uid={uid} />
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
			return <GroupItem data={item} isSearch={isSearch} onClick={onClick} />;
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
}: {
	onClick: any;
	isSearch: boolean;
	data: IGroup;
}) => {
	const time = formatTime(data.updatedAt);
	return (
		<button
			onClick={() => onClick(data, data.members)}
			className="text-gray-700 border-b flex text-left items-center gap-3 border-b-gray-100 py-2"
		>
			<ListAvatar username={data.name} />
			<section className="flex-1">
				<h5 className="font-medium whitespace-nowrap">{data.name}</h5>
				<p className="text-sm">{shortenString(data.description)}</p>
			</section>
			{!isSearch && (
				<span className="self-baseline justify-end text-gray-400 text-sm">
					{time}
				</span>
			)}
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
	const user = isSearch ? data : data.users.filter((u:any) => u._id !== uid)[0];
	const time = formatTime(user.updatedAt);
	return (
		<button
			onClick={() => onClick({ ...user, type: 'user' }, [user._id])}
			className="text-gray-700 border-b flex text-left items-center gap-3 border-b-gray-100 py-2"
		>
			<ListAvatar username={user.username} />
			<section className="flex-1">
				<h5 className="font-medium">{user.name}</h5>
				<p className="text-sm">{shortenString(user.username)}</p>
			</section>
			{!isSearch && (
				<span className="self-baseline justify-end text-gray-400 text-sm">
					{time}
				</span>
			)}
		</button>
	);
};
