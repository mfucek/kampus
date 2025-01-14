import { PageHeader } from '@/global/components/page-header';

import { Container } from '@/global/components/container';
import { SubscriptionPlanSection } from '@/modules/user/components/sections/subscription-plan';

export const SettingsSubscriptionPage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title="Subscription Plan" />

			<SubscriptionPlanSection />
		</Container>
	);
};
