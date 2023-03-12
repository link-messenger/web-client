import { useGetUserProfile } from 'hooks';
import { NormalInput, SearchInput } from '../core';
import { IConversation, IGroup } from 'interfaces';
import { EN_US } from 'languages';
import { useChatStore } from 'store';
import { ListAvatar } from 'components/partials';
import { shortenString, usernameShorter } from 'utils/str';
import { formatTime } from 'utils/time';

export const ChatList = ({
	combined,
	uid,
}: {
	combined?: any[];
	uid: string;
}) => {
	if (!combined || !combined.length)
		return <section className="">{EN_US['chat.ChatEmpty']}</section>;
	const currentChat = useChatStore((state) => state.currentChat);
	const setCurrentChat = useChatStore((state) => state.setCurrentChat);
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
			<SearchInput placeholder="Search..." />
			<section className="text-gray-400 font-medium flex items-center gap-1.5">
				<i className="uil uil-comment-alt-message text-xl font-bold"></i>
				{EN_US['chat.AllMessages']}
			</section>
			<section className="flex-grow flex flex-col overflow-scroll scrollbar-hide gap-2">
				{combined.map((item) => (
					<ChatItem
						key={item._id}
						onClick={(name: string, members:string[]) =>
							setCurrentChat({
								id: item._id,
								type: item.type,
								name,
								members: members,
							})
						}
						item={item}
						uid={uid}
					/>
				))}
			</section>
		</section>
	);
};

export const ChatItem = ({
	item,
	uid,
	onClick,
}: {
	onClick: Function;
	item: any;
	uid: string;
}) => {
	switch (item.type) {
		case 'group':
			return <GroupItem data={item} onClick={onClick} />;
		case 'user':
			return <ConversationItem data={item} uid={uid} onClick={onClick} />;
		default:
			return <section>{EN_US['chat.ItemNotExist']}</section>;
	}
};

export const GroupItem = ({
	data,
	onClick,
}: {
	onClick: any;
	data: IGroup;
}) => {
	const time = formatTime(data.updatedAt);
	return (
		<button
			onClick={() => onClick(data.name, data.members)}
			className="text-gray-700 border-b flex text-left items-center gap-3 border-b-gray-100 py-2"
		>
			<ListAvatar username={data.name} />
			<section className="flex-1">
				<h5 className="font-medium whitespace-nowrap">{data.name}</h5>
				<p className="text-sm">{shortenString(data.description)}</p>
			</section>
			<span className="self-baseline justify-end text-gray-400 text-sm">
				{time}
			</span>
		</button>
	);
};

export const ConversationItem = ({
	data,
	uid,
	onClick,
}: {
	onClick: any;
	data: IConversation;
	uid: string;
}) => {
	const user = data.users.filter((u) => u._id !== uid)[0];
	const time = formatTime(user.updatedAt);
	return (
		<button
			onClick={() => onClick(user.username, [user._id])}
			className="text-gray-700 border-b flex text-left items-center gap-3 border-b-gray-100 py-2"
		>
			<ListAvatar username={user.username} />
			<section className="flex-1">
				<h5 className="font-medium">{user.name}</h5>
				<p className="text-sm">{shortenString(user.username)}</p>
			</section>
			<span className="self-baseline justify-end text-gray-400 text-sm">
				{time}
			</span>
		</button>
	);
};
