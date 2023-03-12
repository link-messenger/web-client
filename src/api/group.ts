import { get, post } from "./base";

export const postCreateGroup = (data: any) =>
  post("/group", data).then((res) => res.data);

export const getUserGroupDetail = (id: string) =>
	get(`/group/${id}`).then((res) => res.data);
