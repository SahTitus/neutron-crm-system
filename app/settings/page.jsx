import { Thinking } from '@components/common/loaders/Thinking';
import { sessionFromServer } from '@lib/fetchData';
import { fetchUser } from '@server_actions/user.action';
import dynamic from 'next/dynamic';
import React from 'react'
import { routes, SITE_URL } from '@lib/routes';
import { seoConfig } from '@lib/seo/seoConfig';
import { settingsMetadata } from '@lib/seo/seoMetadata';

export const metadata = seoConfig({
	url: SITE_URL,
	image: routes.neutronIcon,
	title: settingsMetadata.title,
	creator: settingsMetadata.creator.name,
	keywords: settingsMetadata.keywords,
	description: settingsMetadata.description,
});


const SettingsPage = dynamic(() => import("@components/pages/settings/SettingsPage"),
	{ ssr: false, loading: () => <Thinking bgColor={false} /> },
);

const page = async () => {
	const user = await sessionFromServer();

	const userData = await fetchUser(user?.id);

	return (
		<main className="main-page">
			<SettingsPage user={userData} />
		</main>
	)
}

export default page