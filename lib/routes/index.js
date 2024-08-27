export const routes = {
    home: '/',
    auth: '/auth',
    customers: '/customers',
    sales: '/sales',
    campaigns: '/campaigns',
    settings: '/settings',
    neutronIcon: "/neutron-short.png",
};

export const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/gasod/image/upload'
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION == "false";
export const SITE_URL = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : 'http://localhost:3000';
export const sitemapURL = `${SITE_URL}/sitemap.xml`;