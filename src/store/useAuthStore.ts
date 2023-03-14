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
	user: IUser | null;
	setToken: (token: string) => void;
	setUser: (user: IUser) => void;
	clearAll: () => void;
	setAuth: (token: string, user: IUser) => void;
}

export const useAuthStore = create<IAuthState>()(
	persist(
		(set, get) => ({
			token: '',
			user: null,

			setToken: (token: string) => set({ token, user: get()?.user }),
			setUser: (user: IUser) => set({ token: get()?.token, user }),
			clearAll: () => set({ token: '', user: null }),
			setAuth: (token, user) => set({ token, user }),
		}),
		{
			name: 'OLU_AUTH',
			partialize: (state) => ({ token: state.token, user: state.user }),
		}
	)
);

export const clearAuthStorage = useAuthStore.getState().clearAll;