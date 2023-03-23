import { IChat, IConversation, IGroup, IUser } from 'interfaces';
import { create } from 'zustand';
import { getCurrentChatId, getSocket, setCurrentChatId } from './useChatStore';

interface IChatListState {
	chats: IChat[] | null;
	currentChat: IChat | null;
	reloadChat: boolean;
	setReloadChat: (reload: boolean) => void;
	getChatList: () => IChat[] | null;
	setChats: (chats: IChat[]) => void;
	clearChats: () => void;
	addGroup: (grp: IGroup) => void;
	editChat: (chat: Partial<IChat>) => void;
	removeGroup: (gip: string) => void;
	addConv: (conv: IConversation) => void;
	removeConv: (cid: string) => void;
	joinGroup: (gid: string) => void;
	leaveGroup: (gid: string) => void;
	setJoinListener: () => (() => void) | undefined;
	setJoinConfirmListener: () => (() => void) | undefined;
	setLeaveConfirmListener: () => (() => void) | undefined;
	setLeaveListener: () => (() => void) | undefined;
	getCurrentChat: () => IChat | null;
	setCurrentChat: (chat: IChat | null) => void;
	iterateToGetChat: (cid: string) => IChat | null;
}

export const useChatListStore = create<IChatListState>((set, get) => ({
	chats: null,
	currentChat: null,
	reloadChat: false,
	setReloadChat: (reload) => set({ reloadChat: reload }),
	getChatList: () => get().chats,
	setChats: (chats) => {
		set({
			chats,
		});
	},
	clearChats: () => {
		set({ chats: [] });
	},
	addConv: (conv) => {
		const chats = get().chats;
		const trimmed: IChat = {
			_id: conv._id,
			type: 'user',
			unseen: 0,
			createdAt: conv.createdAt,
			updatedAt: conv.updatedAt,
			users: conv.users.map((usr) => ({
				_id: usr._id,
				name: usr.name,
				username: usr.username,
			})),
		};
		if (!chats) {
			set({
				chats: [trimmed],
			});
			return;
		}
		const find = chats.find(({ _id }) => _id === conv._id);
		if (!!find) return;
		set({
			chats: [trimmed, ...chats],
		});
	},
	removeConv: (cid) => {},
	addGroup: (grp) => {
		console.log(grp);
		const pre = get().chats;
		const trimmed: IChat = {
			_id: grp._id,
			type: 'group',
			unseen: 0,
			createdAt: grp.createdAt,
			updatedAt: grp.updatedAt,
			description: grp.description,
			members: grp.members,
			name: grp.name,
		};
		if (!pre) {
			set({
				chats: [trimmed],
			});
		} else {
			set({ chats: [trimmed, ...pre] });
		}
		setCurrentChatId(grp._id);
	},
	iterateToGetChat: (cid: string) => {
		const current = get().chats?.find((c) => c._id === cid);
		return current ? current : null;
	},
	getCurrentChat: () => get().currentChat,
	setCurrentChat: (chat) => {
		get().editChat({
			_id: chat?._id,
			unseen: 0,
		});
		set({ currentChat: chat });
	},
	editChat: (chat) => {
		const chats = get().chats;
		if (!chats) return;
		const target: IChat[] = chats.reduce((acc, curr) => {
			if (curr._id === chat._id) {
				return [{ ...curr, ...chat }, ...acc];
			}
			return [...acc, curr];
		}, [] as IChat[]);

		set({ chats: target });
	},

	removeGroup: (gip) => {
		const chats = get().chats;
		if (!chats) return;
		const currentChats = chats.filter((grp) => grp._id !== gip);
		set({ chats: currentChats });
	},
	joinGroup: (gid) => {
		const socket = getSocket();
		if (!socket) return;
		socket.emit('join-group', gid);
	},
	leaveGroup: (gid) => {
		const socket = getSocket();
		if (!socket) return;
		socket.emit('leave-group', gid);
	},
	setJoinListener: () => {
		const socket = getSocket();
		if (!socket) return;

		socket.on('user-joined', ({ group, user }) => {
			const chats = get().chats;
			if (!chats) return;
			const cid = getCurrentChatId();
			const currentChats = chats.map((data) => {
				if (data._id === group._id) {
					return {
						...data,
						members: [...group.members],
					} as IChat;
				}
				return data;
			});
			const chat = currentChats.find(({ _id }) => _id === cid);
			set({ currentChat: chat, chats: currentChats });
		});

		return () => {
			socket.off('user-joined');
		};
	},
	setJoinConfirmListener: () => {
		const socket = getSocket();
		if (!socket) return;
		const addGroup = get().addGroup;
		socket.on('joined', (grp) => addGroup(grp));
		socket.on('already-joined', (grp) => {
			setCurrentChatId(grp._id);
		});
		return () => {
			socket.off('joined');
			socket.off('already-joined');
		};
	},
	setLeaveListener: () => {
		const socket = getSocket();
		if (!socket) return;
		socket.on(
			'user-left',
			({ group, user }: { group: IGroup; user: IUser }) => {
				const chats = get().chats;
				const cid = getCurrentChatId();
				if (!chats) return;
				const currentChats = chats.map((data) => {
					if (data._id === group._id) {
						return {
							...data,
							members: data.members?.filter(({ user: u }) => u !== user._id),
						};
					}
					return data;
				});
				const currentChat = currentChats.find(({ _id }) => _id === cid);
				set({
					currentChat: currentChat,
					chats: currentChats,
				});
			}
		);

		return () => {
			socket.off('user-left');
		};
	},
	setLeaveConfirmListener: () => {
		const socket = getSocket();
		if (!socket) return;
		socket.on('left', (group: IGroup) => {
			get().removeGroup(group._id);
			setCurrentChatId('');
		});

		return () => {
			socket.off('left');
		};
	},
}));

export const getCurrentChat = useChatListStore.getState().getCurrentChat;
export const setCurrentChat = useChatListStore.getState().setCurrentChat;
export const iterateToGetCurrentChat =
	useChatListStore.getState().iterateToGetChat;

export const getChatList = useChatListStore.getState().getChatList;
export const editChat = useChatListStore.getState().editChat;
export const removeGroup = useChatListStore.getState().removeGroup;
