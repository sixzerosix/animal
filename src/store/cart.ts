import { create } from "zustand";

export type ShopItem = {
	id: string;
	name: string;
	price: number;
	category: string;
	img?: string;
};

type CartState = {
	cart: ShopItem[];
	addToCart: (item: ShopItem) => void;
	removeFromCart: (idx: number) => void;
	clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
	cart: [],
	addToCart: (item) => set((s) => ({ cart: [...s.cart, item] })),
	removeFromCart: (idx) =>
		set((s) => ({ cart: s.cart.filter((_, i) => i !== idx) })),
	clearCart: () => set(() => ({ cart: [] })),
}));
