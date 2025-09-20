'use client';

import Link from 'next/link';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { Logo } from '@/global/components/logo';
import { ActionsGroup } from '@/global/molecules/navbar/actions-group';
import { Divider } from '@/global/molecules/navbar/divider';
import { isStaging } from '@/lib/environment';
import { useIsPWA } from '@/lib/pwa/use-is-pwa';
import { Button } from '@/lib/shadcn/ui/button';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';
import { SignIn } from '@/modules/onboarding/components/sign-in';
import Image from 'next/image';

export const Navbar = () => {
	const { isSignedIn } = useAuth();

	const { isMobile } = useViewportSize();
	const { isPWA } = useIsPWA();

	const { data: profilePictureUrl } =
		api.user.profilePicture.sessionUser.getUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	if (isMobile && isPWA) return null;

	const Links = () => {
		const scrollToSection = (id: string) => {
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		};

		return (
			<>
				<div className="hidden md:flex flex-row gap-4 sm:gap-6">
					<nav className="flex flex-row gap-4 sm:gap-6">
						<a
							className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
							onClick={() => scrollToSection('features')}
						>
							O platformi
						</a>
						<a
							className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
							onClick={() => scrollToSection('how-it-works')}
						>
							Kako radi
						</a>
						{/* <a
							className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
							onClick={() => scrollToSection('pricing')}
						>
							Članstvo
						</a> */}
						<a
							className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
							onClick={() => scrollToSection('faq')}
						>
							FAQ
						</a>
					</nav>
					<Divider />
				</div>
			</>
		);
	};

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<ActionsGroup>
						<ThemeToggler size="sm" />
					</ActionsGroup>
					<Divider />
					<Link href="/settings/profile">
						<div className="w-8 h-8 rounded-full border border-neutral-weak bg-neutral-weak relative overflow-hidden clickable">
							{profilePictureUrl && (
								<Image
									src={profilePictureUrl}
									alt="User"
									className="object-cover"
									fill
									sizes="80px"
									quality={80}
								/>
							)}
						</div>
					</Link>
				</>
			);
		}

		return (
			<ActionsGroup>
				<ThemeToggler size="sm" />
				<div className="hidden md:block">
					<Button
						// onClick={() => openSignUp({ forceRedirectUrl: pathname })}
						theme="neutral"
						size="sm"
						variant="solid-weak"
					>
						Registriraj se
					</Button>
				</div>
				<SignIn>
					<Button
						// onClick={() => openSignIn({ forceRedirectUrl: pathname })}
						theme="accent"
						size="sm"
						variant="solid"
					>
						Ulogiraj se
					</Button>
				</SignIn>
			</ActionsGroup>
		);
	};

	return (
		<div className="bg-gradient-to-b from-background to-background/0 backdrop-blur-md border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2 shrink-0 fixed w-full z-50">
			<Link href="/" className="flex flex-row">
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
				<div className="ml-1 px-2 flex items-center gap-2 bg-neutral-weak caption rounded-md">
					<span className="caption text-neutral">BETA</span>
				</div>
			</Link>
			<div className="flex flex-row gap-4 items-center">
				<Links />
				<Actions />
			</div>
		</div>
	);
};
