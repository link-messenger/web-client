import { Categories } from 'api';
import { IConversation, IGroup } from 'interfaces';
import { create } from 'zustand';
import {  getCurrentChatId, getSocket, setCurrentChatId } from './useChatStore';

interface ChatsType extends Partial<IGroup>, Partial<IConversation> {
	type: string;
}

interface IChatListState {
	chats: ChatsType[] | null;
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
}

export const useChatListStore = create<IChatListState>((set, get) => ({
	chats: null,
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
	getCurrentChat: () => {
		const current = getCurrentChatId();
		const chats = get().chats;
		const res = chats?.find((c) => c._id === current);
		return !!res ? res : null;
	},

	removeGroup: (gip) => {},
	joinGroup: (gid) => {
		const socket = getSocket();
		if (!socket) return;
		console.log('j-c',gid);
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
			const currentChats = chats.map((data) => {
				if (data._id === group._id) {
					const members = data?.members as string[];
					return {
						...data,
						members: [...members, user._id],
					};
				}
				return data;
			});

			set({ chats: currentChats });
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
		socket.on('user-left', ({ group, user }) => {
			const chats = get().chats;
			if (!chats) return;
			const currentChats = chats.map((data) => {
				if (data._id === group._id) {
					return {
						...data,
						members: [
							// @ts-ignore
							...data.members.filter((usr) => usr !== user._id),
						],
					};
				}
				return data;
			});
			set({ chats: currentChats });
		});

		return () => {
			socket.off('user-left');
		};
	},
	setLeaveConfirmListener: () => {
		const socket = getSocket();
		if (!socket) return;
		socket.on('left', (group) => {
			const chats = get().chats;
			if (!chats) return;
			const currentChats = chats.filter((grp) => grp._id !== group._id);
			set({ chats: currentChats });
		});

		return () => {
			socket.off('left');
		};
	},
}));


export const getCurrentChat = useChatListStore.getState().getCurrentChat;