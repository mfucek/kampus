'use client';

import { type FC } from 'react';

import { cn } from '@/lib/shadcn/utils';
import { api } from '@/lib/trpc/react';
import { useIsMobile } from '@/utils/useMediaQuery';
import { useAuth, useClerk } from '@clerk/nextjs';
import { cva } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './icon';

const NavButton: FC<{
	icon?: IconName;
	image?: string | null;
	label: string;
	selected: boolean;
	href: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}> = ({ icon, image, label, selected = false, href, onClick }) => {
	const textClass = cva('overline', {
		variants: {
			selected: {
				true: 'text-accent',
				false: 'text-neutral-strong'
			}
		}
	});

	const imageContainerClass = cva(
		'w-6 h-6 rounded-full overflow-hidden bg-neutral-medium border',
		{
			variants: {
				selected: {
					true: 'border-accent',
					false: 'border-transparent'
				}
			}
		}
	);

	const iconClass = cva('', {
		variants: {
			selected: {
				true: 'bg-accent',
				false: 'bg-neutral-strong'
			}
		}
	});

	return (
		<Link
			href={href}
			className={cn(
				'flex flex-col gap-1',
				'items-center',
				'flex-1 py-2 bg-opacity-100'
			)}
			onClick={onClick}
		>
			{icon && (
				<Icon icon={icon} className={iconClass({ selected })} size={24} />
			)}
			{(image ?? image === null) && (
				<div className={imageContainerClass({ selected })}>
					{image && <Image src={image} alt={label} width={24} height={24} />}
				</div>
			)}
			<p className={textClass({ selected })}>{label}</p>
		</Link>
	);
};

export const MobileNavbar = () => {
	const pathname = usePathname();

	const { isSignedIn } = useAuth();
	const { openSignUp } = useClerk();

	const { isMobile } = useIsMobile();

	const { data: profilePictureUrl } =
		api.account.getCurrentUserProfilePictureUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	const isNotifications = pathname === '/notifications';
	const isSettings = pathname === '/settings';
	const isSearch = pathname === '/colleges';
	const isHome = !isNotifications && !isSettings && !isSearch;

	const hideNavbar = ['/post/', '/settings/'].some(
		(pathBeginning) =>
			pathname.startsWith(pathBeginning) && pathname !== pathBeginning
	);

	// const isOnPWA =
	// 	typeof window !== 'undefined' &&
	// 	window.matchMedia('(display-mode: standalone)').matches;

	if (!isMobile || hideNavbar) return null;

	return (
		<div
			className={cn(
				'sticky bottom-0 left-0 right-0 bg-section bg-opacity-[0.9] backdrop-blur-2xl border-t border-t-neutral-weak',
				'standalone:pb-8',
				'z-20',
				'flex flex-row'
			)}
		>
			<NavButton icon="home" label="Home" selected={isHome} href="/" />

			<NavButton
				icon="search"
				label="Search"
				selected={isSearch}
				href="/colleges"
			/>

			{/* <NavButton
				icon="bell"
				label="Notifications"
				selected={isNotifications}
				href="/notifications"
			/> */}

			<NavButton
				image={profilePictureUrl ?? null}
				label="Profile"
				selected={isSettings}
				onClick={(e) => {
					if (!isSignedIn) {
						e.preventDefault();
						openSignUp({ forceRedirectUrl: pathname });
					}
				}}
				href="/settings"
			/>
		</div>
	);
};

export const MobileNavbarPadding = () => {
	return <div className="h-[105px] bg-red-500 shrink-0" />;
};
