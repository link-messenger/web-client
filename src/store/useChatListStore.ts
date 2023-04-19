import { calcLength } from 'framer-motion';
import { IChat, IConversation, IGroup, IUser, UserStatus } from 'interfaces';
import { create } from 'zustand';
import { getCurrentChatId, getSocket, setCurrentChatId } from './useChatStore';

type IChatState = Omit<IChat, '_id'>;

interface IChatListState {
	chats: Map<string, IChatState> | null;
	currentChat: IChat | null;
	reloadChat: boolean;
	setReloadChat: (reload: boolean) => void;
	getChatList: () => Map<string, IChatState> | null;
	setChats: (chats: IChat[]) => void;
	clearChats: () => void;
	addGroup: (grp: IGroup) => void;
	editChat: (id: string,chat: Partial<IChatState>, ordered?: boolean) => void;
	removeGroup: (gip: string) => void;
	addConv: (conv: IConversation) => void;
	removeConv: (cid: string) => void;
	joinGroup: (gid: string) => void;
	leaveGroup: (gid: string) => void;
	setJoinListener: () => (() => void) | undefined;
	setJoinConfirmListener: () => (() => void) | undefined;
	setLeaveConfirmListener: () => (() => void) | undefined;
	setLeaveListener: () => (() => void) | undefined;
	setStatusListener: () => (() => void) | undefined;
	getCurrentChat: () => IChat | null;
	setCurrentChat: (chat: IChat | null) => void;
	getIterableChatList: () => IChat[];
}

export const useChatListStore = create<IChatListState>((set, get) => ({
	chats: null,
	currentChat: null,
	reloadChat: false,
	setReloadChat: (reload) => set({ reloadChat: reload }),
	getChatList: () => get().chats,
	setChats: (chats) => {
		const map = new Map<string, IChatState>();
		for (const {_id,...chat} of chats) {
			map.set(_id, chat);	
		}
		set({
			chats: map,
		})
	},
	clearChats: () => {
		set({ chats: new Map() });
	},
	addConv: (conv) => {
		const chats = get().chats;
		const trimmed: IChatState = {
			type: 'user',
			unseen: 0,
			createdAt: conv.createdAt,
			updatedAt: conv.updatedAt,
			users: conv.users.map((usr) => ({
				_id: usr._id,
				name: usr.name,
				username: usr.username,
			})),
			status: conv.status,
		};
		if (!chats) {
			set({
				chats: new Map([[conv._id, trimmed]]),
			});
			return;
		}
		const find = chats.has(conv._id);
		if (!!find) return;
		chats.set(conv._id, trimmed);
	},
	removeConv: (cid) => {},
	addGroup: (grp) => {
		const pre = get().chats;
		const trimmed: IChatState = {
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
				chats: new Map([[grp._id, trimmed]]),
			});
		} else {
			pre.set(grp._id, trimmed);
			set({ chats: pre });
		}
		setCurrentChatId(grp._id);
	},
	getCurrentChat: () => get().currentChat,
	setCurrentChat: (chat) => {
		if (!chat) {
			return set({ currentChat: chat });
		}
		get().editChat(
			chat._id,
			{
				unseen: 0,
			},
		);
		console.log(chat._id)
		set({ currentChat: chat });
	},
	editChat: (id,chat, ordered = false) => {
		const chats = get().chats;
		if (!chats) return;
		const target = chats.get(id);
		if (!target) return;
		const changed = {
			...target,
			...chat,
		};

		console.log(changed, target, chat)

		if (ordered) {
			chats.delete(id);
			chats.set(id, changed);
			console.log(chats.get(id));
			set({ chats, });
			return;
		}
		chats.set(id, changed);
		set({ chats, });
	},

	removeGroup: (gip) => {
		const chats = get().chats;
		if (!chats) return;
		chats.delete(gip);
		set({
			chats,
		})
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
			const chat = chats.get(group._id);
			if (!chat) return;
			chat?.members?.push(user);
			chats.set(group._id, chat);
			set({ chats });
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
				if (!chats) return;
				const chat = chats.get(group._id);
				if (!chat) return;
				const members = chat?.members?.filter(({user: u}) => user._id === u);
				chat.members = members;
				chats.set(group._id, chat);
				set({ chats });
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
	setStatusListener: () => {
		const socket = getSocket();
		if (!socket) return;
		
		socket.on('user-status', (conv: { _id: string; status: UserStatus }) => {
			const currentChat = get().currentChat;
			const chat = get().chats?.get(conv._id);
			if (!chat) return;
			if (currentChat?._id === conv._id) {
				get().setCurrentChat({
					...currentChat,
					status: conv.status,
				});
			}
			get().editChat(
				conv._id,
				{
					...chat,
					status: conv.status,
				}
			);
		});
		return () => {
			socket.off('user-status');
		};
	},
	getIterableChatList: () => {
		const chats = get().chats?.entries();
		if (!chats) return [];
		return [...chats].map(([id, chat]) => ({ _id:id , ...chat })).reverse();
	}
}));

export const getCurrentChat = useChatListStore.getState().getCurrentChat;
export const setCurrentChat = useChatListStore.getState().setCurrentChat;
export const getChatList = useChatListStore.getState().getChatList;
export const editChat = useChatListStore.getState().editChat;
export const removeGroup = useChatListStore.getState().removeGroup;
