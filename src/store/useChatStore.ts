import { getLastMessages, Categories } from 'api';
import { IUser } from 'interfaces';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import {
	getCurrentChat,
	iterateToGetCurrentChat,
	removeGroup,
	setCurrentChat,
} from './useChatListStore';

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
	onModel: Categories;
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
	initSocket: (uid: string) => () => void;
	disconnect: () => void;
	addMessage: (msg: IMessage) => void;
	addRecievedMessage: (msg: IMessage) => void;
	loadChat: (current: any, page?: number) => void;
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
			transports: ['websocket', 'polling'],
			forceNew: true,
			reconnectionAttempts: 3,
		});
		set({
			socket,
		});
		return () => {
			 socket.disconnect();
		};
	},
	disconnect: () => {
		const socket = get().socket;
		if (!socket) return;
		socket.off();
		socket.disconnect();
	},
	getCurrentChatId: () => get().currentChat,
	clearChat: () => {
		set({ currentChat: '', currentMessages: [] });
	},
	addMessage: (msg) => {
		set({ currentMessages: [msg, ...get().currentMessages] });
	},
	loadChat: async (currentChat, page?: number) => {
		if (!currentChat) return;
		const chats = await getLastMessages(
			currentChat._id as string,
			currentChat.type as Categories,
			page
		).catch((err) => {
			console.log(err);
			if (err.response.status === 404) {
				removeGroup(currentChat._id);
			}
		});
		set({ currentMessages: chats });
	},
	sendMessage: (msg) => {
		const socket = get().socket;
		if (!socket) return;
		socket.emit('send-message', msg);
	},
	addRecievedMessage: (msg) => {
		set({ recieved: [msg, ...get().recieved] });
	},
	setCurrentChat: (id) => {
		if (!id) {
			setCurrentChat(null);
			set({ currentChat: '' });
			return;
		}
		const current = iterateToGetCurrentChat(id);
		if (current) {
			setCurrentChat(current);
			set({ currentChat: id });
		}
	},
	setMessageListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		const addRecievedMessage = get().addRecievedMessage;
		socket.on('recieve-message', (msg: IMessage) => {
			const currentChat = getCurrentChat() as any;
			if (
				currentChat &&
				msg.onModel === currentChat.type &&
				((currentChat.type === 'user' &&
					!!currentChat.users.find((u: IUser) => u._id === msg.sender._id)) ||
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
