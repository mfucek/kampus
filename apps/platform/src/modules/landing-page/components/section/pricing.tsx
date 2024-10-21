'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export const PricingSection = () => {
	const { isLoaded } = useUser();
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	const { data: subscriptionSessionData } =
		api.stripe.getSubscriptionCheckoutURL.useQuery(void {}, {
			enabled: isLoaded && isSignedIn
		});

	const { data: lifetimeSessionData } =
		api.stripe.getLifetimeCheckoutURL.useQuery(void {}, {
			enabled: isLoaded && isSignedIn
		});

	const handleGoToSubscriptionCheckoutSession = async () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}

		const redirectURL = subscriptionSessionData?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	const handleGoToLifetimeCheckoutSession = async () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}

		const redirectURL = lifetimeSessionData?.redirectURL;

		if (redirectURL) {
			window.location.assign(redirectURL);
		}
	};

	return (
		<section
			id="pricing"
			className="bg-neutral-weak flex flex-col items-center gap-10 py-20"
		>
			<Container>
				<div className="space-y-2">
					<h2 className="display-2 text-center mb-4">Podrži Referada.hr</h2>
					<p className="body-1 text-neutral-strong text-center">
						Buraz, ova pretplata te dođe manje nego potrošiš na kavu. Podrži
						stranicu i osiguraj si sve pogodnosti!
					</p>
				</div>
			</Container>
			<Container wide>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>Student</CardTitle>
							</CardHeader>
							<div className="display-3">Besplatno</div>
							<ul className="mt-4 space-y-2">
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Neograničen pristup svim raspravama
								</li>
								<li className="flex items-center gap-2 text-neutral-medium">
									<Icon
										icon="checkmark"
										size={24}
										className="bg-neutral-medium"
									/>
									2 AI sažetka po temi
								</li>
								<li className="flex items-center gap-2 text-neutral-medium">
									<Icon
										icon="checkmark"
										size={24}
										className="bg-neutral-medium"
									/>
									10 preuzimanja mjesecno
								</li>
							</ul>
						</CardContent>
						<Button
							variant={'outline'}
							className="w-full"
							onClick={handleGoToSubscriptionCheckoutSession}
						>
							Odaberi
						</Button>
					</Card>
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>Sponzor</CardTitle>
							</CardHeader>
							<div className="display-3">
								3 EUR
								<span className="text-neutral-strong title-1"> / mo</span>
							</div>
							<ul className="mt-4 space-y-2">
								<li className="flex items-center gap-2 text-neutral-medium">
									<Icon
										icon="checkmark"
										size={24}
										className="bg-neutral-medium"
									/>
									Pristup svim AI sažetcima
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Supporter badge
								</li>
								<li className="flex items-center gap-2 text-neutral-medium">
									<Icon
										icon="checkmark"
										size={24}
										className="bg-neutral-medium"
									/>
									30 preuzimanja mjesecno
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Dark mode
								</li>
							</ul>
						</CardContent>
						<Button
							className="w-full"
							onClick={handleGoToSubscriptionCheckoutSession}
						>
							Odaberi
						</Button>
					</Card>
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>Legenda</CardTitle>
							</CardHeader>
							<div className="display-3">
								5 EUR
								<span className="text-neutral-strong title-1"> / mo</span>
							</div>
							<ul className="mt-4 space-y-2">
								<li className="flex items-center gap-2 text-neutral-medium">
									<Icon icon="checkmark" size={24} />
									Objavljuj oglase
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Make-your-own badge
								</li>
							</ul>
						</CardContent>
						<Button
							variant={'outline'}
							className="w-full"
							onClick={handleGoToLifetimeCheckoutSession}
						>
							Odaberi
						</Button>
					</Card>
				</div>
			</Container>
		</section>
	);
};
