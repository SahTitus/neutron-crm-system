import { sitemapURL } from "@lib/routes";

export default function robots() {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/auth", "/settings", "/api", "/dashboard"],
			},
		],
		sitemap: [sitemapURL],
	};
};