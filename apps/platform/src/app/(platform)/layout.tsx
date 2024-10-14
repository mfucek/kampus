import { Navbar } from '@/modules/global/components/navbar';
import type { FC, PropsWithChildren } from 'react';

const PublicLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col">
			<Navbar />
			<div className="flex-1 bg-background md:p-2">{children}</div>
		</div>
	);
};

export default PublicLayout;
