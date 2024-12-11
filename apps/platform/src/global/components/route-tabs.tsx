'use client';

import Link from 'next/link';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type FC,
	type HTMLAttributes,
	type PropsWithChildren
} from 'react';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { usePathname } from 'next/navigation';

interface CurrentTabContextType {
	currentTab: string | null;
	setCurrentTab: (tab: string | null) => void;
}

const currentTabContext = createContext<CurrentTabContextType | null>(null);

const useCurrentTab = () => {
	const context = useContext(currentTabContext);

	if (!context) {
		throw new Error('useCurrentTab must be used within a Tabs component');
	}

	return context;
};

export const Tabs = ({
	children,
	className,
	...props
}: PropsWithChildren & HTMLAttributes<HTMLDivElement>) => {
	const [currentTab, setCurrentTab] = useState<string | null>(null);

	const pathname = usePathname();

	useEffect(() => {
		setCurrentTab(pathname);
	}, [pathname]);

	return (
		<div
			className={cn(
				'flex flex-row gap-2 overflow-y-visible overflow-x-auto shrink-0 w-full py-2 scrollbar-hidden',
				className
			)}
			{...props}
		>
			<currentTabContext.Provider value={{ currentTab, setCurrentTab }}>
				{children}
			</currentTabContext.Provider>
		</div>
	);
};

export const Tab: FC<
	{
		route: string;
	} & PropsWithChildren
> = ({ route, children }) => {
	const { currentTab, setCurrentTab } = useCurrentTab();

	const isActive = currentTab === route;

	return (
		<Link href={route}>
			<Button
				variant={isActive ? 'solid' : 'outline'}
				theme={isActive ? 'accent' : 'neutral'}
				size="md"
				rounded
				onClick={() => setCurrentTab(route)}
			>
				{children}
			</Button>
		</Link>
	);
};
