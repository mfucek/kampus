import { PageHeader } from '@/global/components/page-header';

import { Container } from '@/global/components/container';
import { DangerZoneSection } from '@/modules/user/components/sections/danger-zone';
import { PublicProfileSection } from '@/modules/user/components/sections/public-profile';

export const SettingsProfilePage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader
				title="Public Profile"
				breadcrumbs={[
					{ title: 'Postavke', link: '/settings' },
					{ title: 'Profil', link: '/settings/profile' }
				]}
			/>

			<PublicProfileSection />

			{/* <AccountInfoSection /> */}

			<DangerZoneSection />
		</Container>
	);
};
