import { create } from 'zustand';

interface MenuState {
  open: boolean;
  toggle: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
}));

