import { api } from '@/deps/trpc/server';
import { redirect } from 'next/navigation';
import { SettingsMenuLayout } from './settings-menu-layout';

export const SettingsLayout = async ({
	children
}: {
	children: React.ReactNode;
}) => {
	const me = await api.user.me();

	if (!me) {
		redirect('/');
	}

	return <SettingsMenuLayout>{children}</SettingsMenuLayout>;
};
