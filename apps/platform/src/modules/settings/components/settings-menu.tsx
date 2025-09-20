'use client';

import { useAuth } from '@/deps/better-auth/use-auth';
import { useViewportSize } from '@/deps/viewport-size';
import { env } from '@/env';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { RuleProtected } from '@/modules/user/permissions/components/protected';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileProfileCard } from '../components/mobile-profile-card';

const Divider = ({ visibility }: { visibility?: 'desktop' | 'mobile' }) => {
	const dividerVariants = cva('h-px w-full bg-background', {
		variants: {
			visibility: {
				default: 'block',
				desktop: 'hidden md:block',
				mobile: 'block md:hidden'
			}
		},
		defaultVariants: {
			visibility: 'default'
		}
	});
	return <div className={dividerVariants({ visibility })} />;
};

const isActive = (pathname: string, path: string) => {
	return pathname === path ? 'solid-weak' : 'ghost';
};

const UserSection = () => {
	const pathname = usePathname();
	const { isMobile } = useViewportSize();

	return (
		<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
			{/* <Button variant="ghost" className="w-full">
				<Icon icon="user-add" />
				<span className="w-full text-left">Pozovi prijatelja</span>
			</Button> */}

			<Link href="/settings/profile" replace={!isMobile}>
				<Button
					variant={isActive(pathname, '/settings/profile')}
					className="w-full hidden md:flex md:h-14"
				>
					<Icon icon="user" />
					<span className="w-full text-left">Profil</span>
				</Button>
			</Link>
		</div>
	);
};

const AdminSection = () => {
	const pathname = usePathname();
	const { isMobile } = useViewportSize();

	return (
		<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
			<Link href="/settings/manage-users" replace={!isMobile}>
				<Button
					variant={isActive(pathname, '/settings/manage-users')}
					className="w-full md:h-14"
				>
					<Icon icon="user-role" />
					<span className="w-full text-left">Upravljanje Korisnicima</span>
				</Button>
			</Link>
		</div>
	);
};

const PreferencesSection = () => {
	const pathname = usePathname();
	const { isMobile } = useViewportSize();
	const { signOut } = useAuth();

	return (
		<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
			<Link href="/settings/appearance" replace={!isMobile}>
				<Button
					variant={isActive(pathname, '/settings/appearance')}
					className="w-full md:h-14"
				>
					<Icon icon="mode-dark" />
					<span className="w-full text-left">Izgled</span>
				</Button>
			</Link>

			<Divider />

			<Button
				variant={isActive(pathname, '/settings/appearance')}
				className="w-full md:h-14"
				theme="danger"
				onClick={() => signOut()}
			>
				<Icon icon="log-out" />
				<span className="w-full text-left text-theme">Odjavi se</span>
			</Button>
		</div>
	);
};

const InfoSection = () => {
	return (
		<div className="flex flex-col gap-2 text-center items-center pb-10">
			<p className="body-3 text-neutral-strong">
				Kampus Beta v{env.NEXT_PUBLIC_VERSION}
			</p>
			<p className="body-3 text-neutral-strong">
				Made with ❤️ by{' '}
				<a
					href="https://wireframe.hr"
					className="button-sm hover:underline underline-offset-4 text-neutral"
					target="_blank"
				>
					Wireframe Studio{' '}
				</a>
			</p>
			<p className="body-3 text-neutral-strong">
				© {new Date().getFullYear()} - Sva prava pridržana.
			</p>
		</div>
	);
};

export const SettingsMenu = () => {
	return (
		<div className="px-3 md:px-0 w-full md:w-auto">
			<div className="w-full h-full md:bg-section rounded-lg md:w-[320px] flex shrink-0 flex-col gap-6">
				<MobileProfileCard />

				<div className="flex flex-col gap-3 md:gap-0 md:flex-1">
					<UserSection />

					<Divider visibility="desktop" />

					<RuleProtected rule="CAN_MANAGE_USERS">
						<AdminSection />

						<Divider visibility="desktop" />
					</RuleProtected>

					<PreferencesSection />

					<Divider visibility="desktop" />
				</div>

				<InfoSection />
			</div>
		</div>
	);
};
