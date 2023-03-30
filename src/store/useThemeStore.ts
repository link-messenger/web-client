import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Themes = 'dark' | 'light';

interface IThemeState {
	theme: Themes;
	setTheme: (theme: Themes) => void;
}

export const useThemeStore = create<IThemeState>()(
	persist(
		(set, get) => ({
			theme: 'light',
			setTheme: (theme) => {
				set({ theme });
			},
		}),
		{
			name: 'LINK_THEME',
			partialize: (state) => ({
				theme: state.theme,
			}),
		}
	)
);
