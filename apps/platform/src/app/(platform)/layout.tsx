import { Navbar } from '@/global/molecules/navbar/navbar';
import { type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-full md:h-screen overflow-x-hidden overscroll-x-none overflow-y-hidden">
				<Navbar />
				{children}
			</div>
		</>
	);
};

export default Layout;
