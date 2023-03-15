import { Categories } from 'api';
import { IConversation, IGroup, IUser } from 'interfaces';
import { create } from 'zustand';
import { getCurrentChatId, getSocket, setCurrentChatId } from './useChatStore';

interface ChatsType extends Partial<IGroup>, Partial<IConversation> {
	type: string;
}

interface IChatListState {
	chats: ChatsType[] | null;
	currentChat: ChatsType | null;
	reloadChat: boolean;
	setReloadChat: (reload: boolean) => void;
	setChats: (grp: IGroup[], conv: IConversation[]) => void;
	clearChats: () => void;
	addGroup: (grp: IGroup) => void;
	removeGroup: (gip: string) => void;
	addConv: (cid: string) => void;
	removeConv: (cid: string) => void;
	joinGroup: (gid: string) => void;
	leaveGroup: (gid: string) => void;
	setJoinListener: () => (() => void) | undefined;
	setJoinConfirmListener: () => (() => void) | undefined;
	setLeaveConfirmListener: () => (() => void) | undefined;
	setLeaveListener: () => (() => void) | undefined;
	getCurrentChat: () => ChatsType | null;
	setCurrentChat: (chat: ChatsType | null) => void;
	iterateToGetChat: (cid: string) => ChatsType | null;
}

export const useChatListStore = create<IChatListState>((set, get) => ({
	chats: null,
	currentChat: null,
	reloadChat: false,
	setReloadChat: (reload) => set({ reloadChat: reload }),
	setChats: (grp, conv) => {
		const markedGroups = grp.map((item) => ({ ...item, type: 'group' }));
		const markedConversations = conv.map((item) => ({
			...item,
			type: 'user',
		}));

		set({
			chats: [...markedGroups, ...markedConversations],
		});
	},
	clearChats: () => {
		set({ chats: [] });
	},
	addConv: (conv) => {},
	removeConv: (cid) => {},
	addGroup: (grp) => {
		const pre = get().chats;
		if (!pre) {
			set({ chats: [{ ...grp, type: 'group' }] });
		} else {
			set({ chats: [{ ...grp, type: 'group' }, ...pre] });
		}
		setCurrentChatId(grp._id);
	},
	iterateToGetChat: (cid: string) => {
		const current = get().chats?.find((c) => c._id === cid);
		return current ? current : null;
	},
	getCurrentChat: () => get().currentChat,
	setCurrentChat: (chat) => {
		set({ currentChat: chat });
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
		console.log('j-c', gid);
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
					const members = [
						// @ts-ignore
						...data.members,
						{ user: user._id, role: 'USER', _id: user._id + user.name },
					];
					return {
						...data,
						members,
					};
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
							members: [
								// @ts-ignore
								...data.members.filter(({ user: u }) => u !== user._id),
							],
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
export const removeGroup = useChatListStore.getState().removeGroup;