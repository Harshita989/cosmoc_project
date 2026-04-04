export type Product = {
	id: string;
	name: string;
	slug: string;
	description: string;
	priceCents: number;
	imageUrl: string;
	tags?: string[];
	inStock: boolean;
};

export const formatPrice = (priceCents: number): string => {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "USD",
	}).format(priceCents / 100);
};

export const products: Product[] = [
	{
		id: "p-tee-001",
		name: "Essential Tee",
		slug: "essential-tee",
		description: "Soft cotton tee with a classic fit. Your everyday staple.",
		priceCents: 1999,
		imageUrl: "/vercel.svg",
		tags: ["apparel", "tops"],
		inStock: true,
	},
	{
		id: "p-hoodie-002",
		name: "Cozy Hoodie",
		slug: "cozy-hoodie",
		description: "Mid-weight fleece hoodie for all-season comfort.",
		priceCents: 4999,
		imageUrl: "/next.svg",
		tags: ["apparel", "outerwear"],
		inStock: true,
	},
	{
		id: "p-cap-003",
		name: "Logo Cap",
		slug: "logo-cap",
		description: "Adjustable cotton cap with embroidered logo.",
		priceCents: 2499,
		imageUrl: "/globe.svg",
		tags: ["accessories"],
		inStock: true,
	},
	{
		id: "p-mug-004",
		name: "Ceramic Mug",
		slug: "ceramic-mug",
		description: "12oz ceramic mug. Microwave and dishwasher safe.",
		priceCents: 1499,
		imageUrl: "/window.svg",
		tags: ["home"],
		inStock: true,
	},
];

export const findProductBySlug = (slug: string): Product | undefined => {
	return products.find((p) => p.slug === slug);
};



