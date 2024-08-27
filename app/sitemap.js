import { routes, SITE_URL } from "@lib/routes";

export default async function sitemap() {
    const routeURLs = Object.entries(routes).map(([key, link]) => ({
        url: `${SITE_URL}${link}`,
        lastModified: new Date().toISOString(),
        changeFrequency: `monthly`,
    }));

    return routeURLs;
}
