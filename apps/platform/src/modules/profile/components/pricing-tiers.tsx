'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { useUser } from '@clerk/nextjs';

export const PricingTiers = () => {
	const { isLoaded } = useUser();

	const { data: subscriptionSessionData } =
		api.stripe.getSubscriptionCheckoutURL.useQuery(void {}, {
			enabled: isLoaded
		});

	const { data: lifetimeSessionData } =
		api.stripe.getLifetimeCheckoutURL.useQuery(void {}, {
			enabled: isLoaded
		});

	const handleGoToSubscriptionCheckoutSession = async () => {
		const redirectURL = subscriptionSessionData?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	const handleGoToLifetimeCheckoutSession = async () => {
		const redirectURL = lifetimeSessionData?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	return (
		<div>
			<Button onClick={handleGoToSubscriptionCheckoutSession}>
				Purchase monthly
			</Button>
			<Button onClick={handleGoToSubscriptionCheckoutSession}>
				Purchase monthly pro
			</Button>
			<Button onClick={handleGoToLifetimeCheckoutSession}>
				Purchase lifetime
			</Button>
		</div>
	);
};
