import { getLastMessages, Categories } from 'api';
import { IGroup } from 'interfaces';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { getCurrentChat } from './useChatListStore';

interface IMessage {
	content: string;
	type: MessageTypes;
	sender: {
		name: string;
		username: string;
		_id: string;
		email: string;
	};
	_id: string;
	onModal: Categories;
	to: string;
	createdAt: string;
}

export type MessageTypes = 'FILE' | 'MESSAGE' | 'IMAGE' | 'VOICE';

interface ISendable {
	content: string;
	type: MessageTypes;
	to: string;
	model: Categories;
}
export interface IChatType {
	name: string;
	type: Categories;
	id: string;
	members: string[];
}

interface IChatState {
	socket: null | Socket;
	currentChat: string;
	currentMessages: IMessage[];
	recieved: IMessage[];
	initSocket: (uid: string) => Function;
	addMessage: (msg: IMessage) => void;
	addRecievedMessage: (msg: IMessage) => void;
	loadChat: (page?: number) => void;
	sendMessage: (msg: ISendable) => void;
	setMessageListener: () => (() => void) | undefined;
	messageConfirmListener: () => (() => void) | undefined;
	clearChat: () => void;
	getSocket: () => Socket | null;
	setCurrentChat: (id: string) => void;
	getCurrentChatId: () => string;
}

// TODO: working perfectly fine! push notification

export const useChatStore = create<IChatState>((set, get) => ({
	socket: null,
	currentChat: '',
	currentMessages: [],
	recieved: [],
	initSocket: (uid: string) => {
		const socket = io(import.meta.env.VITE_API_BASE_URL, {
			port: '4000',
			auth: {
				id: uid,
			},
		});
		set({
			socket,
		});
		return socket.disconnect;
	},
	getCurrentChatId: () => get().currentChat,
	clearChat: () => {
		set({ currentChat: '', currentMessages: [] });
	},
	addMessage: (msg) => {
		set({ currentMessages: [...get().currentMessages, msg] });
	},
	loadChat: async (page?: number) => {
		const currentChat = getCurrentChat();
		if (!currentChat) return;
		const chats = await getLastMessages(
			currentChat._id as string,
			currentChat.type as Categories,
			page
		);
		set({ currentMessages: chats.reverse() });
	},
	sendMessage: (msg) => {
		const socket = get().socket;
		if (!socket) return;
		socket.emit('send-message', msg);
	},
	addRecievedMessage: (msg) => {
		set({ recieved: [...get().recieved, msg] });
	},
	setCurrentChat: (id) => set({ currentChat: id }),
	setMessageListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		const addRecievedMessage = get().addRecievedMessage;
		socket.on('recieve-message', (msg: IMessage) => {
			const currentChat = getCurrentChat() as any;
			if (
				currentChat &&
				((currentChat.type === 'user' &&
					currentChat.users.find((u: any) => u._id === msg.sender._id)) ||
					currentChat._id === msg.to)
			) {
				addMessage(msg);
			} else {
				addRecievedMessage(msg);
			}
		});
		return () => {
			socket.off('recieve-message');
		};
	},
	messageConfirmListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		socket.on('message-sent', (msg: IMessage) => {
			addMessage(msg);
		});
		return () => {
			socket.off('message-sent');
		};
	},
	getSocket: () => get().socket,
}));

export const getSocket = useChatStore.getState().getSocket;
export const setCurrentChatId = useChatStore.getState().setCurrentChat;
export const getCurrentChatId = useChatStore.getState().getCurrentChatId;
