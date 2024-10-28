'use client';

import { env } from '@/env';
import { Button } from '@/lib/shadcn/ui/button';
import { useTranslation } from '@/utils/translations/use-translation';
import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

export const Navbar = () => {
	const { t } = useTranslation('hr');
	const { openSignIn } = useClerk();

	const { isSignedIn } = useAuth();

	const Nav = () => {
		const scrollToSection = (id: string) => {
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		};

		return (
			<nav className="hidden md:flex gap-4 sm:gap-6">
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('features')}
				>
					Značajke
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('how-it-works')}
				>
					Kako radi
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('pricing')}
				>
					Članstvo
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('faq')}
				>
					FAQ
				</a>
			</nav>
		);
	};

	const Actions = () => {
		if (isSignedIn) {
			return (
				<Link href="/home">
					<Button theme="accent" size="md" variant="solid">
						{t.goToPlatform}
					</Button>
				</Link>
			);
		}

		return (
			<Button
				onClick={() => openSignIn({ afterSignInUrl: '/home' })}
				theme="accent"
				size="md"
				variant="solid"
			>
				{t.register}
			</Button>
		);
	};

	return (
		<div className="bg-foreground backdrop-blur-md border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2 shrink-0 fixed w-full z-50">
			<Link href="/">
				<div className="title-3">
					Kampus.hr
					{env.NEXT_PUBLIC_DEPLOYMENT === 'staging' && (
						<span className="ml-1 px-2 bg-danger text-danger-contrast caption rounded-xl">
							STG
						</span>
					)}
				</div>
			</Link>
			<div className="flex flex-row gap-4 items-center">
				<Nav />
				<Actions />
			</div>
		</div>
	);
};
