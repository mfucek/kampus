'use client';

import { Container } from '@/global/components/container';
import { Button } from '@/lib/shadcn/ui/button';
import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

export const HeroSection = () => {
	const { isSignedIn } = useAuth();
	const { openSignUp } = useClerk();

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const Actions = () => {
		if (isSignedIn) {
			return (
				<Link href="/home">
					<Button>Idi na platformu</Button>
				</Link>
			);
		}
		return (
			<>
				<Button
					onClick={() => openSignUp({ afterSignInUrl: '/home' })}
					theme="accent"
					size="md"
					variant="solid"
				>
					Pridruži se besplatno
				</Button>
				<Button onClick={() => scrollToSection('features')} variant="outline">
					Saznaj više
				</Button>
			</>
		);
	};

	return (
		<section className="flex flex-col items-center py-40 bg-section" id="hero">
			<Container>
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="flex flex-col items-center gap-6">
						<h1 className="display-1">Dobrodošli na Kampus.hr</h1>
						<p className="max-w-[640px] text-neutral-strong">
							Tvoj virtualni kampus za razmjenu znanja, iskustava i materijala.
							Spojimo sve studente u Hrvatskoj!
						</p>
					</div>
					<div className="flex flex-row gap-4">
						<Actions />
					</div>
				</div>
			</Container>
		</section>
	);
};
