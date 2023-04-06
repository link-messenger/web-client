import { UserStatus } from "./user";

export interface IGroup {
	_id: string;
	name: string;
	description: string;
	members: { user: string; role: string; _id: string }[];
	createdAt: string;
	updatedAt: string;
	status: string;
	link: string;
}

export interface IUser {
	_id: string;
	name: string;
	email: string;
	username: string;
	createdAt: string;
	updatedAt: string;
}

export interface IProfile {
	name: string;
	email: string;
	username: string;
	createdAt: string;
	updatedAt: string;
	id: string;
}

export interface IConversation {
	_id: string;
	users: IUser[];
	createdAt: string;
	updatedAt: string;
	status: UserStatus;
}

export interface IGroupDetail extends Omit<IGroup, 'members'> {
	members: { user: IUser; role: string; _id: string }[];
}

export interface IChat {
	type: 'user' | 'group';
	unseen: number;
	_id: string;
	name?: string;
	description?: string;
	members?: { user: string; role: string; _id: string }[];
	users?: Omit<IUser, 'email' | 'createdAt' | 'updatedAt'>[];
	status?: UserStatus;
	createdAt: string;
	updatedAt: string;
	lastMessage?: {
		to: string;
		content: string;
		createdAt: string;
		sender: {
			_id: string;
			name: string;
			username: string;
			updatedAt: string;
		};
	};
}
