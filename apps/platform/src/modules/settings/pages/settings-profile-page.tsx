import { PageHeader } from '@/global/components/page-header';

import { Container } from '@/global/components/container';
import { AccountInfoSection } from '@/modules/user/components/sections/account-info';
import { DangerZoneSection } from '@/modules/user/components/sections/danger-zone';
import { PublicProfileSection } from '@/modules/user/components/sections/public-profile';

export const SettingsProfilePage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title="Public Profile" />

			<PublicProfileSection />

			<AccountInfoSection />

			<DangerZoneSection />
		</Container>
	);
};
