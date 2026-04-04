import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
	// simple server/page shell with client summary via inline component
	return (
		<main className="max-w-3xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Checkout</h1>
			<p className="text-muted-foreground mb-6">
				This is a placeholder. Connect a payment provider (Stripe) and order storage next.
			</p>
			<Summary />
			<Link href="/products" className="text-blue-600 hover:underline mt-6 inline-block">
				← Continue shopping
			</Link>
		</main>
	);
}

function Summary() {
	// client subcomponent to read cart
	// using dynamic import style isn't necessary; this runs only on client parts
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { subtotalCents } = useCart();
	return (
		<section className="border rounded p-4">
			<p className="font-medium mb-2">Order Summary</p>
			<div className="flex items-center justify-between">
				<span>Subtotal</span>
				<span className="font-semibold">{formatPrice(subtotalCents)}</span>
			</div>
		</section>
	);
}



