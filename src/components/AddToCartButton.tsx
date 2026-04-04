"use client";

import * as React from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function AddToCartButton({ product }: { product: Product }) {
	const { addToCart } = useCart();
	return (
		<button
			type="button"
			onClick={() => addToCart(product, 1)}
			disabled={!product.inStock}
			className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 disabled:opacity-50"
		>
			Add to cart
		</button>
	);
}



