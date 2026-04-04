import Link from "next/link";
import { products, formatPrice } from "@/lib/products";

export default function ProductsPage() {
	return (
		<main className="max-w-5xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Products</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map((p) => (
					<Link
						key={p.id}
						href={`/products/${p.slug}`}
						className="border rounded-lg p-4 hover:shadow-md transition"
					>
						<div className="aspect-video bg-white/5 rounded mb-3 flex items-center justify-center">
							<img
								src={p.imageUrl}
								alt={p.name}
								className="h-12 opacity-80"
							/>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{p.name}</p>
								<p className="text-sm text-muted-foreground">
									{p.inStock ? "In stock" : "Out of stock"}
								</p>
							</div>
							<p className="font-semibold">{formatPrice(p.priceCents)}</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}



