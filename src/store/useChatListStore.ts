import { Categories } from 'api';
import { IConversation, IGroup } from 'interfaces';
import { create } from 'zustand';

type ChatsType = { type: string } & (IGroup | IConversation);

interface IChatListState {
	chats: ChatsType[] | null;
	setChats: (grp: IGroup[], conv: IConversation[]) => void;
	clearChats: () => void;
	addGroup: (grp: IGroup) => void;
	removeGroup: (gip: string) => void;
	addConv: (cid: string) => void;
	removeConv: (cid: string) => void;
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
	clearChats: () => {},
	addConv: (conv) => {},
	removeConv: (cid) => {},
	addGroup: (grp) => {},
	removeGroup: (gip) => {},
}));
