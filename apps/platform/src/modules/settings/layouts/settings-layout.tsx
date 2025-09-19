'use client';

import { useViewportSize } from '@/deps/viewport-size';
import { usePathname } from 'next/navigation';
import { SettingsMenu } from '../components/settings-menu';

export const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
	const { isMobile } = useViewportSize();
	const pathname = usePathname();

	const isSettings = pathname === '/settings';

	const showMenu = isMobile ? isSettings : true;

	return (
		<div className="flex flex-row md:p-2 md:gap-2 w-full md:h-[calc(100vh-56px)]">
			{showMenu && <SettingsMenu />}

			<div className="rounded-lg md:bg-section flex flex-col items-center flex-1 overflow-y-scroll">
				{children}
			</div>
		</div>
	);
};
