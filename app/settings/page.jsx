import { Thinking } from '@components/common/loaders/Thinking';
import { sessionFromServer } from '@lib/fetchData';
import { fetchUser } from '@server_actions/user.action';
import dynamic from 'next/dynamic';
import React from 'react'

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