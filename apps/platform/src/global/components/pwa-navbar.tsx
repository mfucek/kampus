'use client';

import { type FC } from 'react';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { useIsPWA } from '@/lib/pwa/use-is-pwa';
import { cn } from '@/lib/shadcn/utils';
import { SignIn } from '@/modules/onboarding/components/sign-in';
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
				'flex-1 py-2'
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

export const PWANavbar = () => {
	const pathname = usePathname();

	const { isSignedIn } = useAuth();

	const { isDesktop } = useViewportSize();
	const { isPWA } = useIsPWA();

	const { data: profilePictureUrl } =
		api.user.profilePicture.sessionUser.getUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	const isNotifications = pathname === '/notifications';
	const isSettings = pathname === '/settings';
	const isSearch = pathname === '/colleges';
	const isOnContent = !isNotifications && !isSettings && !isSearch;

	const hideNavbar = ['/post/', '/settings/'].some(
		(pathBeginning) =>
			pathname.startsWith(pathBeginning) && pathname !== pathBeginning
	);

	if (isDesktop || !isPWA || hideNavbar) return null;

	return (
		<div
			className={cn(
				'sticky bottom-0 left-0 right-0 bg-section/90 backdrop-blur-2xl border-t border-t-neutral-weak',
				'standalone:pb-8',
				'z-20',
				'flex flex-row'
			)}
		>
			<NavButton icon="home" label="Home" selected={isOnContent} href="/home" />
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
			{!isSignedIn && (
				<SignIn>
					<NavButton
						image={profilePictureUrl ?? null}
						label="Profile"
						selected={isSettings}
						onClick={(e) => e.preventDefault()}
						href="/settings"
					/>
				</SignIn>
			)}
			{isSignedIn && (
				<NavButton
					image={profilePictureUrl ?? null}
					label="Profile"
					selected={isSettings}
					href="/settings"
				/>
			)}
		</div>
	);
};

export const MobileNavbarPadding = () => {
	return <div className="h-[105px] bg-red-500 shrink-0" />;
};
