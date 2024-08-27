import { creator, siteName } from "@lib/constants";
import { routes, SITE_URL } from "@lib/routes";

export const seoRobot_config = {
	index: true,
	follow: true,
	googleBot: {
		index: true,
		follow: true,
	}
};

export const seoConfig = async ({ keywords, title, image, description, publishedAt, url }) => {
	const img = {
		url: image,
		width: 1000,
		height: 680,
		alt: siteName,
		type: "image/jpeg",
	};
	const seo = {
		title: `${title}`,
		description: `${description} - ${siteName}`,
	// category: 'Website',
		siteName: siteName,
		keywords: keywords,
		startUrl: routes?.home,
		manifest: routes?.manifest,
		metadataBase: new URL(SITE_URL),
		creator: creator,
		publisher: creator,
		openGraph: {
			title: title,
			description: description,
			// type: 'website',
			siteName: siteName,
			url: url,
			publishedTime: publishedAt ? publishedAt : "",
			images: ["/neutron.png"],
		},
		twitter: {
			title: title,
			description: description,
			images: ["/neutron.png"],
			card: 'summary_large_image',
		},
		alternates: {
			canonical: url,
		},
		robots: seoRobot_config,
	};

	return seo;
};