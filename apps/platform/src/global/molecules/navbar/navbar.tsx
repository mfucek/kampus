'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { env } from '@/env';
import { Logo } from '@/global/components/logo';
import { useIsPWA } from '@/lib/pwa/use-is-pwa';
import { Button } from '@/lib/shadcn/ui/button';
import { feedbackFormURL } from '@/modules/feedback/constants';
import { SignIn } from '@/modules/onboarding/components/sign-in';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';
import { Icon } from '../../components/icon';
import { ActionsGroup } from './actions-group';
import { Breadcrumbs } from './breadcrumbs';
import { Divider } from './divider';

const isStaging = env.NEXT_PUBLIC_DEPLOYMENT === 'staging';

export const Navbar = () => {
	const { isSignedIn } = useAuth();

	const { isMobile } = useViewportSize();
	const { isPWA } = useIsPWA();

	const { data: profilePictureUrl } =
		api.account.getCurrentUserProfilePictureUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	if (isMobile && isPWA) return null;

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<ActionsGroup className="hidden md:flex">
						{/* <Button size="sm" variant="solid-weak" theme="accent">
							Podrzi nas
						</Button> */}
						<a
							href={feedbackFormURL}
							className="hidden md:block"
							target="_blank"
							rel="noopener norefferer"
						>
							<Button size="sm" variant="solid-weak">
								Feedback
								<Icon icon="help" />
							</Button>
						</a>
					</ActionsGroup>
					<Divider className="hidden md:block" />
					<ActionsGroup>
						<ThemeToggler size="sm" />
						{/* <NotificationsButton /> */}
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
			<>
				<ThemeToggler />
				<SignIn>
					<Button theme="accent" size="md" variant="solid">
						Ulogiraj se
					</Button>
				</SignIn>
			</>
		);
	};

	return (
		<div className="bg-section md:border-b md:border-b-neutral-weak h-14 flex flex-row justify-between items-center px-2 shrink-0">
			<div className="flex flex-row gap-3 items-center">
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
				<div className="hidden md:block">
					<Breadcrumbs />
				</div>
			</div>
			<div className="flex flex-row gap-4 items-center">
				<Actions />
			</div>
		</div>
	);
};
