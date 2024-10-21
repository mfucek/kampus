import { Navbar } from '@/modules/landing-page/components/navbar';
import type { FC, PropsWithChildren } from 'react';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-col w-screen h-screen overflow-y-scroll">
			<Navbar />
			{children}
		</div>
	);
};

export default PublicLayout;
