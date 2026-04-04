/* Client cart context for simple MVP checkout flows (local state only) */
"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
	productId: string;
	name: string;
	priceCents: number;
	imageUrl: string;
	qty: number;
};

type CartState = {
	items: CartItem[];
};

type AddPayload = { product: Product; qty?: number };
type UpdateQtyPayload = { productId: string; qty: number };
type RemovePayload = { productId: string };
type ClearPayload = Record<string, never>;

type CartAction =
	| { type: "ADD"; payload: AddPayload }
	| { type: "UPDATE_QTY"; payload: UpdateQtyPayload }
	| { type: "REMOVE"; payload: RemovePayload }
	| { type: "CLEAR"; payload: ClearPayload };

const CartContext = createContext<{
	state: CartState;
	addToCart: (product: Product, qty?: number) => void;
	updateQty: (productId: string, qty: number) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
	subtotalCents: number;
	totalItems: number;
} | null>(null);

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD": {
			const { product, qty = 1 } = action.payload;
			const existing = state.items.find((i) => i.productId === product.id);
			if (existing) {
				return {
					items: state.items.map((i) =>
						i.productId === product.id ? { ...i, qty: i.qty + qty } : i
					),
				};
			}
			return {
				items: [
					...state.items,
					{
						productId: product.id,
						name: product.name,
						priceCents: product.priceCents,
						imageUrl: product.imageUrl,
						qty,
					},
				],
			};
		}
		case "UPDATE_QTY": {
			const { productId, qty } = action.payload;
			if (qty <= 0) {
				return { items: state.items.filter((i) => i.productId !== productId) };
			}
			return {
				items: state.items.map((i) =>
					i.productId === productId ? { ...i, qty } : i
				),
			};
		}
		case "REMOVE": {
			return { items: state.items.filter((i) => i.productId !== action.payload.productId) };
		}
		case "CLEAR": {
			return initialState;
		}
		default:
			return state;
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	const subtotalCents = useMemo(
		() => state.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0),
		[state.items]
	);
	const totalItems = useMemo(
		() => state.items.reduce((sum, i) => sum + i.qty, 0),
		[state.items]
	);

	const value = useMemo(
		() => ({
			state,
			addToCart: (product: Product, qty?: number) =>
				dispatch({ type: "ADD", payload: { product, qty } }),
			updateQty: (productId: string, qty: number) =>
				dispatch({ type: "UPDATE_QTY", payload: { productId, qty } }),
			removeFromCart: (productId: string) =>
				dispatch({ type: "REMOVE", payload: { productId } }),
			clearCart: () => dispatch({ type: "CLEAR", payload: {} }),
			subtotalCents,
			totalItems,
		}),
		[state, subtotalCents, totalItems]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart must be used within CartProvider");
	}
	return ctx;
}



