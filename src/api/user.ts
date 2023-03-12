import { get } from "./base";

export const getUserById = (id: string) => get(`/conversation/${id}`).then((res) => res.data);