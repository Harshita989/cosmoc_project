"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
	const { state, updateQty, removeFromCart, subtotalCents } = useCart();
	const hasItems = state.items.length > 0;

	return (
		<main className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Your Cart</h1>
			{!hasItems ? (
				<div className="rounded border p-6">
					<p className="mb-4">Your cart is empty.</p>
					<Link href="/products" className="text-blue-600 hover:underline">
						Browse products →
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2 space-y-4">
						{state.items.map((item) => (
							<div key={item.productId} className="flex items-center gap-4 border rounded p-4">
								<div className="w-16 h-16 bg-white/5 rounded flex items-center justify-center">
									<img src={item.imageUrl} alt={item.name} className="h-6 opacity-80" />
								</div>
								<div className="flex-1">
									<p className="font-medium">{item.name}</p>
									<p className="text-sm text-muted-foreground">{formatPrice(item.priceCents)}</p>
								</div>
								<div className="flex items-center gap-2">
									<button
										className="px-2 py-1 border rounded"
										onClick={() => updateQty(item.productId, Math.max(0, item.qty - 1))}
									>
										-
									</button>
									<input
										className="w-12 text-center border rounded py-1"
										type="number"
										min={0}
										value={item.qty}
										onChange={(e) => updateQty(item.productId, Math.max(0, Number(e.target.value)))}
									/>
									<button
										className="px-2 py-1 border rounded"
										onClick={() => updateQty(item.productId, item.qty + 1)}
									>
										+
									</button>
								</div>
								<button
									className="text-sm text-red-600 hover:underline ml-2"
									onClick={() => removeFromCart(item.productId)}
								>
									Remove
								</button>
							</div>
						))}
					</div>
					<aside className="border rounded p-4 h-fit">
						<p className="text-lg font-semibold mb-4">Summary</p>
						<div className="flex items-center justify-between mb-4">
							<span>Subtotal</span>
							<span className="font-medium">{formatPrice(subtotalCents)}</span>
						</div>
						<Link
							href="/checkout"
							className="block text-center rounded-md bg-black text-white px-4 py-2"
						>
							Checkout
						</Link>
					</aside>
				</div>
			)}
		</main>
	);
}



