import { Navbar } from '@/modules/layout/components/navbar';
import { type FC, type PropsWithChildren } from 'react';

export const NavbarLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-full md:h-screen overflow-x-hidden overscroll-x-none overflow-y-hidden">
				<Navbar />
				{children}
			</div>
		</>
	);
};
