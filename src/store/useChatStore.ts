import { getLastMessages, Categories } from 'api';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

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
interface IChatType {
	name: string;
	type: Categories;
	id: string;
	members: string[];
}

interface IChatState {
	socket: null | Socket;
	currentChat: IChatType | null;
	currentMessages: IMessage[];
	recieved: IMessage[];
	setCurrentChat: (chat: IChatType | null) => void;
	initSocket: (uid: string) => Function;
	addMessage: (msg: IMessage) => void;
	addRecievedMessage: (msg: IMessage) => void;
	loadChat: (id: string, type: Categories, page?: number) => void;
	sendMessage: (msg: ISendable) => void;
	setMessageListener: () => (() => void) | undefined;
	messageConfirmListener: () => void;
	clearChat: () => void;
}


// TODO: working perfectly fine! may need furthur preformance improvement + push notification and global listener

export const useChatStore = create<IChatState>((set, get) => ({
	socket: null,
	currentChat: null,
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
	clearChat: () => {
		set({ currentChat: null, currentMessages: [] });
	},
	addMessage: (msg) => {
		set({ currentMessages: [...get().currentMessages, msg] });
	},
	loadChat: async (id: string, type: Categories, page?: number) => {
		const chats = await getLastMessages(id, type, page);
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
	setMessageListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		const addRecievedMessage = get().addRecievedMessage;
		const currentChat = get().currentChat;
		socket.on('recieve-message', (msg: IMessage) => {
			if (
				currentChat &&
				((currentChat.type === 'user' &&
					currentChat.members[0] === msg.sender._id) ||
					currentChat.id === msg.to)
			) {
				addMessage(msg);
			} else {
				addRecievedMessage(msg);
			}
		});
		return () => {
			socket.off('recieve-message');
		}
		
	},
	setCurrentChat: (currentChat) => set({ currentChat }),
	messageConfirmListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		const chat = get().currentChat;
		socket.on('message-sent', (msg: IMessage) => {
			// double check if the message is for the current group
			if (
				chat &&
				((chat.type === 'user' && chat.members[0] === msg.to) ||
					chat.id === msg.to)
			) {
				addMessage(msg);
			}
		});
	},
}));
