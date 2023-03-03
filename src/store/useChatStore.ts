import { pb } from 'api';
import { create } from 'zustand';

interface IMessage {
	content: string;
	user: string;
	created: string;
}

interface IChatState {
	messages: IMessage[];
	addMessage: (msg: IMessage) => void;
	loadChat: () => void;
}

export const useChatStore = create<IChatState>((set, get) => ({
	messages: [],
	addMessage: (msg) => {
		set({ messages: [...get().messages, msg] });
	},
	loadChat: async () => {
		const list = await pb.collection('messages').getList(1, 20, {
			expand: 'user',
			sort: '-created',
		});
		const trimmed: IMessage[] = list.items.reverse().map(
			({ content, user, created }) => ({ content, user, created })
		);
		set({ messages: trimmed });
	},
}));
