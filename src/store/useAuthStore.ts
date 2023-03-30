import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IUser {
	email: string;
	name: string;
	username: string;
	id: string;
	createdAt: string;
}

interface IAuthState {
	token: string;
	refresh: string;
	user: IUser | null;
	setToken: (token: string, refresh: string) => void;
	setUser: (user: IUser) => void;
	clearAll: () => void;
	setAuth: (token: string, refresh: string, user: IUser) => void;
	getToken: () => string;
	getRefresh: () => string;
}

export const useAuthStore = create<IAuthState>()(
	persist(
		(set, get) => ({
			token: '',
			refresh: '',
			user: null,

			setToken: (token, refresh) =>
				set((state) => ({ token, refresh, user: state?.user })),
			setUser: (user) => set({ token: get()?.token, user }),
			clearAll: () => set({ token: '', refresh: '', user: null }),
			setAuth: (token, refresh, user) => set({ token, refresh, user }),
			getToken: () => get().token,
			getRefresh: () => get().refresh,
		}),
		{
			name: 'LINK_AUTH',
			partialize: (state) => ({ token: state.token, refresh: state.refresh, user: state.user }),
		}
	)
);

export const clearAuthStorage = useAuthStore.getState().clearAll;
export const setToken = useAuthStore.getState().setToken;

export const getRefreshToken = useAuthStore.getState().getRefresh;

