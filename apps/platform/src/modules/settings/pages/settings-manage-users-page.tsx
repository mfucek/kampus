import { PageHeader } from '@/global/components/page-header';

import { Container } from '@/global/components/container';
import { ManageUsersSection } from '@/modules/user/components/sections/manage-users';
import { RuleProtected } from '@/modules/user/permissions/components/protected';

export const SettingsManageUsersPage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader
				title="Manage Users"
				breadcrumbs={[
					{ title: 'Postavke', link: '/settings' },
					{ title: 'Upravljanje Korisnicima', link: '/settings/manage-users' }
				]}
			/>

			<RuleProtected rule="CAN_MANAGE_USERS">
				<ManageUsersSection />
			</RuleProtected>
		</Container>
	);
};
