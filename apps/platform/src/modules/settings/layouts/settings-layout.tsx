'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { RuleProtected } from '@/modules/permissions/components/protected';
import { useIsMobile } from '@/utils/useMediaQuery';
import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileProfileCard } from '../components/mobile-profile-card';

const Menu = () => {
	const { signOut } = useClerk();
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname === path ? 'solid-weak' : 'ghost';
	};

	return (
		<div className="w-full h-full md:bg-section rounded-lg md:w-[320px] flex shrink-0 flex-col gap-6">
			<MobileProfileCard />

			<div className="flex flex-col gap-3 md:gap-0">
				<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
					{/* <Button variant="ghost" className="w-full">
						<Icon icon="user-add" />
						<span className="w-full text-left">Pozovi prijatelja</span>
					</Button> */}
					<Link href="/settings/profile">
						<Button
							variant={isActive('/settings/profile')}
							className="w-full hidden md:flex md:h-14"
						>
							<Icon icon="user" />
							<span className="w-full text-left">Profil</span>
						</Button>
					</Link>

					<div className="h-px w-full bg-background hidden md:block" />

					<Link href="/settings/subscription">
						<Button
							variant={isActive('/settings/subscription')}
							className="w-full md:h-14"
						>
							<Icon icon="crown" />
							<span className="w-full text-left">Pretplata</span>
						</Button>
					</Link>
				</div>

				<div className="h-px w-full bg-background hidden md:block" />

				<RuleProtected rule="CAN_MANAGE_USERS">
					<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
						<Link href="/settings/manage-users">
							<Button
								variant={isActive('/settings/manage-users')}
								className="w-full md:h-14"
							>
								<Icon icon="user-role" />
								<span className="w-full text-left">
									Upravljanje Korisnicima
								</span>
							</Button>
						</Link>
					</div>
				</RuleProtected>

				<div className="h-px w-full bg-background hidden md:block" />

				<div className="flex flex-col bg-section py-1 md:py-0 rounded-xl">
					<Link href="/settings/appearance">
						<Button
							variant={isActive('/settings/appearance')}
							className="w-full md:h-14"
						>
							<Icon icon="mode-dark" />
							<span className="w-full text-left">Izgled</span>
						</Button>
					</Link>

					<div className="h-px w-full bg-background" />

					<Button
						variant={isActive('/settings/appearance')}
						className="w-full md:h-14"
						theme="danger"
						onClick={() => signOut({ redirectUrl: '/' })}
					>
						<Icon icon="log-out" />
						<span className="w-full text-left text-theme">Odjavi se</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
	const { isMobile } = useIsMobile();
	const pathname = usePathname();

	const isSettings = pathname === '/settings';

	const showMenu = isMobile ? isSettings : true;

	return (
		<div className="flex flex-row p-2 gap-2 md:h-[calc(100vh-56px)]">
			{showMenu && <Menu />}

			<div className="rounded-lg md:bg-section flex flex-col items-center flex-1 overflow-y-scroll">
				{children}
			</div>
		</div>
	);
};
