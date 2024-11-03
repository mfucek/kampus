'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export const PricingSection = () => {
	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	const handleGoToSubscriptionCheckoutSessionCheap = async () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}

		router.push('/profile#subscription-plan');
	};

	const handleGoToSubscriptionCheckoutSessionPro = async () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}

		router.push('/profile#subscription-plan');
	};

	const handleCreateAccount = async () => {
		await openSignIn();
	};

	return (
		<section
			id="pricing"
			className="bg-neutral-weak flex flex-col items-center gap-10 py-20"
		>
			<Container>
				<div className="space-y-2">
					<h2 className="display-2 text-center mb-4">Podrži Kampus.hr</h2>
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
									Pristup svom sadržaju uz reklame
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />2 AI sažetka po temi
								</li>
							</ul>
						</CardContent>
						<Button
							variant={'outline'}
							className="w-full"
							onClick={handleCreateAccount}
						>
							Kreiraj račun
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
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Pristup svom sadržaju bez reklama
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Pristup svim AI sažetcima
								</li>
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Supporter badge
								</li>
							</ul>
						</CardContent>
						<Button
							className="w-full"
							onClick={handleGoToSubscriptionCheckoutSessionCheap}
						>
							Pretplati se
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
								<li className="flex items-center gap-2">
									<Icon icon="checkmark" size={24} />
									Napravi svoj badge
								</li>
							</ul>
						</CardContent>
						<Button
							variant={'outline'}
							className="w-full"
							onClick={handleGoToSubscriptionCheckoutSessionPro}
						>
							Pretplati se
						</Button>
					</Card>
				</div>
			</Container>
		</section>
	);
};
