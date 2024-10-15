import { ClientPanels } from '@/components/ClientPanels';
import { Navbar } from '@/modules/global/components/navbar';
import type { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col">
			<Navbar />
			<ClientPanels>{children}</ClientPanels>
		</div>
	);
};

export default Layout;
