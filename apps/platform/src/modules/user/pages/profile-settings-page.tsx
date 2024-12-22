import { Container } from '@/global/components/container';
import { type FC } from 'react';

import { ContentPadding } from '@/global/layouts/content-padding';
import { RuleProtected } from '@/modules/permissions/components/protected';
import { AccountInfoSection } from '../components/sections/account-info';
import { DangerZoneSection } from '../components/sections/danger-zone';
import { ManageUsersSection } from '../components/sections/manage-users';
import { PublicProfileSection } from '../components/sections/public-profile';
import { SubscriptionPlanSection } from '../components/sections/subscription-plan';
import { SettingsSection } from '../components/settings-section';

export const ProfileSettingsPage: FC = async () => {
	return (
		<Container className="py-10 gap-20 pb-20">
			<ContentPadding>
				<h1 className="display-3"> Your Profile </h1>
			</ContentPadding>

			<SettingsSection
				title="Public Profile"
				description="Manage your public profile settings"
				id="public-profile"
			>
				<PublicProfileSection />
			</SettingsSection>

			<SettingsSection
				title="Subscription Plan"
				description="Manage your subscription plan"
				id="subscription-plan"
			>
				<SubscriptionPlanSection />
			</SettingsSection>

			<SettingsSection
				title="Account Info"
				description="Account info overview"
				id="account-info"
			>
				<AccountInfoSection />
			</SettingsSection>

			<SettingsSection
				title="Danger Zone"
				description="Dangerous actions that can be taken on your account"
				id="danger-zone"
			>
				<DangerZoneSection />
			</SettingsSection>

			<RuleProtected rule="CAN_MANAGE_USERS">
				<SettingsSection
					title="Manage Users"
					description="Manage users"
					id="manage-users"
				>
					<ManageUsersSection />
				</SettingsSection>
			</RuleProtected>
		</Container>
	);
};
