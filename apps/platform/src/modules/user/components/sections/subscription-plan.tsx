'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { useUser } from '@clerk/nextjs';
import { formatDate } from 'date-fns';
import { SettingsSubSection } from '../settings-subsection';

export const SubscriptionPlanSection = () => {
	const { isLoaded } = useUser();
	const { data: account } = api.account.getAccount.useQuery();

	const { data: subscriptionSessionDataCheap } =
		api.stripe.getSubscriptionCheckoutURL.useQuery(
			{ package: 'MONTHLY_CHEAP' },
			{
				enabled: isLoaded
			}
		);

	const { data: subscriptionSessionDataPro } =
		api.stripe.getSubscriptionCheckoutURL.useQuery(
			{ package: 'MONTHLY_PRO' },
			{
				enabled: isLoaded
			}
		);

	// const { data: lifetimeSessionData } =
	// 	api.stripe.getLifetimeCheckoutURL.useQuery(void {}, {
	// 		enabled: isLoaded
	// 	});

	const { mutateAsync: cancelSubscription } =
		api.stripe.cancelSubscription.useMutation();

	const { mutateAsync: resumeSubscription } =
		api.stripe.resumeSubscription.useMutation();

	const handleGoToSubscriptionCheckoutSessionCheap = async () => {
		const redirectURL = subscriptionSessionDataCheap?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	const handleGoToSubscriptionCheckoutSessionPro = async () => {
		const redirectURL = subscriptionSessionDataPro?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	const handleCancelSubscription = async () => {
		await cancelSubscription();
		window.location.reload();
	};
	const handleResumeSubscription = async () => {
		await resumeSubscription();
		window.location.reload();
	};

	const isFree = account?.status === 'INACTIVE';
	const isSubscribed = account?.status === 'ACTIVE';
	const isCancelled = account?.status === 'CANCELLED';
	const currentPlan = account?.package;

	const planName = (() => {
		switch (currentPlan) {
			case 'MONTHLY_CHEAP':
				return 'Sponzor';
			case 'MONTHLY_PRO':
				return 'Legenda';
			case 'LIFETIME':
				return 'Lifetime';
			default:
				return 'Student';
		}
	})();

	const FreePlanDescription = () => {
		return (
			<ul>
				<li>Pristup svim raspravama uz reklame</li>
				<li>2 AI sažetka po temi</li>
			</ul>
		);
	};

	const SponsorPlanDescription = () => {
		return (
			<ul>
				<li>Pristup svom sadržaju bez reklama</li>
				<li>Pristup svim AI sažetcima</li>
				<li>Supporter badge</li>
			</ul>
		);
	};

	const LegendPlanDescription = () => {
		return (
			<ul>
				<li>Istakni se sa custom badgeom pored imena!</li>
				<li>Zbog ljudi kao ti, stranica je besplatna većini korisnika!</li>
			</ul>
		);
	};

	const OngoingSubcription = () => {
		return (
			<SettingsSubSection
				title="Trenutni plan"
				description={`Trenutno si na ${planName} planu. Hvala ti što podržavaš stranicu!`}
			>
				<Button
					onClick={handleCancelSubscription}
					theme="danger"
					variant="solid-weak"
				>
					Zaustavi pretplatu
				</Button>
			</SettingsSubSection>
		);
	};

	const RemainingTimeInfo = () => {
		return (
			<p className="caption text-center text-accent">
				Ovaj ti plan nastavlja biti aktivan do{' '}
				{formatDate(account?.activeUntil ?? new Date(), 'dd.MM.yyyy.')}
			</p>
		);
	};

	const CancelledSubscription = () => {
		return (
			<SettingsSubSection
				title="Nastavi svoju pretplatu"
				description={`Bio si na ${planName} planu. Nastavi svoju pretplatu i podrži stranicu!`}
			>
				<div className="flex flex-col gap-2 p-4 bg-accent-weak rounded-xl">
					<p className="title-3">Sponzor</p>
					<SponsorPlanDescription />
					{planName === 'Sponzor' && <RemainingTimeInfo />}
					<Button
						onClick={
							planName === 'Sponzor'
								? handleResumeSubscription
								: handleGoToSubscriptionCheckoutSessionCheap
						}
						variant={planName === 'Sponzor' ? 'solid' : 'solid-weak'}
						theme="accent"
					>
						{planName === 'Sponzor'
							? 'Nastavi s Sponzor pretplatom'
							: 'Pretplati se na Sponzor plan'}
					</Button>
				</div>

				<div className="flex flex-col gap-2 p-4 bg-accent-weak rounded-xl">
					<p className="title-3">Legenda</p>
					<LegendPlanDescription />
					{planName === 'Legenda' && <RemainingTimeInfo />}
					<Button
						onClick={
							planName === 'Legenda'
								? handleResumeSubscription
								: handleGoToSubscriptionCheckoutSessionPro
						}
						variant={planName === 'Legenda' ? 'solid' : 'solid-weak'}
						theme="accent"
					>
						{planName === 'Legenda'
							? 'Nastavi s Legenda pretplatom'
							: 'Pretplati se na Legenda plan'}
					</Button>
				</div>
			</SettingsSubSection>
		);
	};

	const NoSubscription = () => {
		return (
			<SettingsSubSection
				title="Pretplati se!"
				description="Hvala ti što koristiš stranicu! Ako želiš podržati stranicu, možeš kupiti pretplatu i dobiti pristup novim funkcionalnostima."
			>
				<div className="flex flex-col gap-2 p-4 bg-neutral-weak rounded-xl">
					<p className="body-2">Trenutno si na Student planu:</p>
					<FreePlanDescription />
				</div>

				<div className="flex flex-col gap-2 p-4 bg-accent-weak rounded-xl">
					<p className="body-2">Sa Sponzor planom dobivaš:</p>
					<SponsorPlanDescription />
					<Button
						onClick={handleGoToSubscriptionCheckoutSessionCheap}
						variant="solid"
						theme="accent"
					>
						Pretplati se na Sponzor plan
					</Button>
				</div>

				<div className="flex flex-col gap-2 p-4 bg-accent-weak rounded-xl">
					<p className="body-2">Sa Legenda planom dobivaš:</p>
					<LegendPlanDescription />
					<Button
						onClick={handleGoToSubscriptionCheckoutSessionPro}
						variant="solid"
						theme="accent"
					>
						Pretplati se na Legenda plan
					</Button>
				</div>
			</SettingsSubSection>
		);
	};

	return (
		<div>
			{isFree && <NoSubscription />}
			{isCancelled && <CancelledSubscription />}
			{isSubscribed && <OngoingSubcription />}
		</div>
	);
};
