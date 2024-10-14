import { Navbar } from '@/modules/global/components/navbar';
import type { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col">
			<Navbar />
			<div className="flex-1 bg-background md:p-2">
				<div className="w-full h-full flex flex-colrounded-lg bg-section justify-center">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Layout;
