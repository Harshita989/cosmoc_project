import Link from "next/link";
import { notFound } from "next/navigation";
import { findProductBySlug, formatPrice } from "@/src/lib/products";
import AddToCartButton from "@/src/components/AddToCartButton";

type PageProps = {
	params: { slug: string };
};

export default function ProductDetailPage({ params }: PageProps) {
	const product = findProductBySlug(params.slug);
	if (!product) {
		return notFound();
	}

	return (
		<main className="max-w-4xl mx-auto px-4 py-8">
			<nav className="mb-6 text-sm">
				<Link href="/products" className="text-blue-600 hover:underline">
					← Back to products
				</Link>
			</nav>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="aspect-video bg-white/5 rounded flex items-center justify-center">
					<img src={product.imageUrl} alt={product.name} className="h-16 opacity-80" />
				</div>
				<div>
					<h1 className="text-2xl font-bold mb-2">{product.name}</h1>
					<p className="text-lg font-semibold mb-4">{formatPrice(product.priceCents)}</p>
					<p className="text-muted-foreground mb-6">{product.description}</p>
					<AddToCartButton product={product} />
				</div>
			</div>
		</main>
	);
}


