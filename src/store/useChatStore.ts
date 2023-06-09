import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

import { getLastMessages, Categories } from 'api';
import { CHAT_HISTORY_LENGTH } from 'constants';
import { trimChats } from 'utils/chats';
import {
	editChat,
	getChatList,
	getCurrentChat,
	removeGroup,
	setCurrentChat,
} from './useChatListStore';

export type MessageStatus = 'seen' | 'unseen';

export interface IDateTag {
	_id: string;
	date: string;
	modelType: 'DATE';
}

export interface IMessage {
	_id: string;
	content: string;
	type: MessageTypes;
	sender: {
		_id: string;
		name: string;
		username: string;
		createdAt: string;
		updatedAt: string;
	};
	to: string;
	status: MessageStatus;
	createdAt: string;
	updatedAt: string;
	modelType: 'MESSAGE';
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
	currentMessages: (IMessage | IDateTag)[];
	chatLoading: boolean;
	pages: {
		hasMore: boolean;
		hasLess: boolean;
		maxNumber: number;
	};
	recieved: IMessage[];
	initSocket: (uid: string) => () => void;
	disconnect: () => void;
	addMessage: (msg: IMessage) => void;
	addRecievedMessage: (msg: IMessage) => void;
	loadChat: (current: any, page: number) => void;
	sendMessage: (msg: ISendable) => void;
	setMessageListener: () => (() => void) | undefined;
	messageConfirmListener: () => (() => void) | undefined;
	clearChat: () => void;
	getSocket: () => Socket | null;
	setCurrentChatId: (id: string) => void;
	getCurrentChatId: () => string;
}

// TODO: working perfectly fine! push notification

export const useChatStore = create<IChatState>((set, get) => ({
	socket: null,
	currentChat: '',
	currentMessages: [],
	recieved: [],
	chatLoading: false,
	pages: {
		hasMore: false,
		hasLess: false,
		maxNumber: 0,
	},
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
		set({ currentMessages: [] });
	},
	addMessage: (msg) => {
		const chatList = getChatList();
		const cid = getCurrentChatId();
		if (chatList) {
			const target = chatList.get(msg.to);
			if (!target) return;
			editChat(msg.to, {
				lastMessage: {
					content: msg.content,
					createdAt: msg.createdAt,
					sender: {
						_id: msg.sender._id,
						name: msg.sender.name,
						updatedAt: msg.sender.updatedAt,
						username: msg.sender.username,
					},
					to: msg.to,
				},
				unseen: msg.to !== cid ? target.unseen + 1 : target.unseen,
			}, true);
		}
		set({
			currentMessages: [
				{
					...msg,
					modelType: 'MESSAGE',
				},
				...get().currentMessages,
			],
		});
	},
	loadChat: async (currentChat, page) => {
		if (!currentChat || (!get().pages.hasMore && page !== 1)) return;
		set({ chatLoading: true });

		const chats = await getLastMessages(currentChat._id as string, page)
			.then((res) => {
				const pages = res.pages;
				set({
					pages: {
						hasMore: pages > page,
						hasLess: page > 1,
						maxNumber: pages,
					},
				});

				set({ chatLoading: false });

				return res.data;
			})
			.catch((err) => {
				if (err.response.status === 404) {
					removeGroup(currentChat._id);
				}
			});
		const trimmedChats = trimChats(chats);
		if (page === 1) {
			set({ currentMessages: trimmedChats });
		} else {
			set((state) => {
				const current = state.currentMessages;
				const pre =
					current.length > CHAT_HISTORY_LENGTH
						? current.slice(-1 * CHAT_HISTORY_LENGTH)
						: current;
				return { currentMessages: [...pre, ...trimmedChats] };
			});
		}
	},
	sendMessage: (msg) => {
		const socket = get().socket;
		if (!socket) return;
		socket.emit('send-message', msg);
	},
	addRecievedMessage: (msg) => {
		const chatList = getChatList();
		const cid = getCurrentChatId();
		if (chatList) {
			const target = chatList.get(msg.to);
			if (target) {
				editChat(msg.to,{
					lastMessage: {
						content: msg.content,
						createdAt: msg.createdAt,
						sender: {
							_id: msg.sender._id,
							name: msg.sender.name,
							updatedAt: msg.sender.updatedAt,
							username: msg.sender.username,
						},
						to: msg.to,
					},
					unseen: msg.to !== cid ? target.unseen + 1 : target.unseen,
				}, true);
			}
		}
		set({ recieved: [msg, ...get().recieved] });
	},
	setCurrentChatId: (id) => {
		if (!id) {
			setCurrentChat(null);
			set({ currentChat: '' });
			return;
		}
		const current = getChatList()?.get(id);
		if (current) {
			setCurrentChat({_id: id, ...current});
			set({ currentChat: id });
		}
	},
	setMessageListener: () => {
		const socket = get().socket;
		if (!socket) return;
		const addMessage = get().addMessage;
		const addRecievedMessage = get().addRecievedMessage;
		socket.on('recieve-message', (msg: IMessage) => {
			const currentChat = getCurrentChat();
			if (currentChat && currentChat._id === msg.to) {
				addMessage(msg);
			} else {
				console.log('ran');
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
export const setCurrentChatId = useChatStore.getState().setCurrentChatId;
export const getCurrentChatId = useChatStore.getState().getCurrentChatId;
