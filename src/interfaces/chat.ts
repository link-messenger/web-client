export interface IGroup {
  _id: string;
  name: string;
  description: string;
  members: string[];
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
}

export interface IGroupDetail extends Omit<IGroup, 'members'> {
  members: {user: IUser, role: string, _id:string}[];
}

