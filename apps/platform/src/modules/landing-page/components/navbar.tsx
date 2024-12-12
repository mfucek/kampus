'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

import { env } from '@/env';
import { Logo } from '@/global/components/logo';
import { ActionsGroup } from '@/global/molecules/navbar/actions-group';
import { Divider } from '@/global/molecules/navbar/divider';
import { Button } from '@/lib/shadcn/ui/button';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';

const isStaging = env.NEXT_PUBLIC_DEPLOYMENT === 'staging';

export const Navbar = () => {
	const { openSignIn, openSignUp } = useClerk();

	const { isSignedIn } = useAuth();

	const Links = () => {
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
				<ActionsGroup>
					<ThemeToggler size="sm" />
					<Link href="/home">
						<Button theme="accent" size="sm" variant="solid">
							idi na platformu
						</Button>
					</Link>
				</ActionsGroup>
			);
		}

		return (
			<ActionsGroup>
				<ThemeToggler size="sm" />
				<Button
					onClick={() => openSignUp({ afterSignInUrl: '/home' })}
					theme="neutral"
					size="sm"
					variant="solid-weak"
				>
					Registriraj se
				</Button>
				<Button
					onClick={() => openSignIn({ afterSignInUrl: '/home' })}
					theme="accent"
					size="sm"
					variant="solid"
				>
					Ulogiraj se
				</Button>
			</ActionsGroup>
		);
	};

	return (
		<div className="bg-transparent backdrop-blur-md border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2 shrink-0 fixed w-full z-50">
			<Link href="/">
				{isStaging && (
					<div className="ml-1 px-2 flex items-center gap-2 bg-danger caption rounded-md">
						<div className="shrink-0 h-[20px] w-[70px]">
							<Logo className="bg-danger-contrast" />
						</div>
						<span className="caption text-danger-contrast">STG</span>
					</div>
				)}
				{!isStaging && (
					<div className="ml-1 px-2 flex items-center gap-2 bg-accent caption rounded-md">
						<div className="shrink-0 h-[20px] w-[70px]">
							<Logo className="bg-accent-contrast shrink-0" />
						</div>
					</div>
				)}
			</Link>
			<div className="flex flex-row gap-4 items-center">
				<Links />
				<Divider />
				<Actions />
			</div>
		</div>
	);
};
