'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { Logo } from '@/global/components/logo';
import { isLocal, isProduction, isStaging } from '@/lib/environment';
import { useIsPWA } from '@/lib/pwa/use-is-pwa';
import { Button } from '@/lib/shadcn/ui/button';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';
import { feedbackFormURL } from '@/modules/feedback/constants';
import { NotificationsButton } from '@/modules/notifications/components/notifications-button';
import { useOnboarding } from '@/modules/onboarding/context/use-onboarding';
import { Icon } from '../../../global/components/icon';
import { ActionsGroup } from '../../../global/molecules/navbar/actions-group';
import { Divider } from '../../../global/molecules/navbar/divider';
import { useLayout } from '../contexts/use-layout';
import { SearchBar } from '../search/search-bar';

export const BrowserNavbar = () => {
	const { isSignedIn } = useAuth();

	const { isMobile, isDesktop } = useViewportSize();
	const { isPWA } = useIsPWA();
	const { showBookmarks, setShowBookmarks } = useLayout();

	const { data: profilePictureUrl } =
		api.user.profilePicture.sessionUser.getUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	if (isMobile && isPWA) return null;

	const Actions = () => {
		const { showSignIn } = useOnboarding();

		if (isSignedIn) {
			return (
				<>
					<ActionsGroup className="hidden md:flex">
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
						<NotificationsButton />
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
				<ThemeToggler size="sm" />
				<Button
					theme="accent"
					size="sm"
					variant="solid"
					onClick={() => showSignIn()}
				>
					Ulogiraj se
				</Button>
			</>
		);
	};

	return (
		<div className="bg-section md:border-b md:border-b-neutral-weak h-14 flex flex-row justify-between items-center px-2 shrink-0 relative">
			<div className="flex flex-row gap-3 items-center">
				{isDesktop && (
					<Button
						variant={showBookmarks ? 'solid-weak' : 'outline'}
						theme={showBookmarks ? 'accent' : 'neutral'}
						size="sm"
						iconOnly
						onClick={() => setShowBookmarks((prev) => !prev)}
					>
						<Icon icon="bookmark" />
					</Button>
				)}

				<Link href="/" className="flex flex-row">
					{isStaging && (
						<div className="ml-1 px-2 flex items-center gap-2 bg-danger caption rounded-md">
							<div className="shrink-0 h-[20px] w-[70px]">
								<Logo className="bg-danger-contrast" />
							</div>
							<span className="caption text-danger-contrast">STG</span>
						</div>
					)}

					{isProduction && (
						<div className="ml-1 px-2 flex items-center gap-2 bg-accent caption rounded-md">
							<div className="shrink-0 h-[20px] w-[70px]">
								<Logo className="bg-accent-contrast shrink-0" />
							</div>
						</div>
					)}

					<div className="ml-1 px-2 flex items-center gap-2 bg-neutral-weak caption rounded-md">
						<span className="caption text-neutral">BETA</span>
					</div>

					{isLocal && (
						<div className="ml-1 px-2 flex items-center gap-2 bg-neutral-medium caption rounded-md">
							<span className="caption text-neutral">LOCAL</span>
						</div>
					)}
				</Link>
			</div>

			<div className="flex flex-row gap-4 items-center">
				<Actions />
			</div>

			<SearchBar />
		</div>
	);
};
