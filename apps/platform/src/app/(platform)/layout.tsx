import { ClientPanels } from '@/components/client-panels';
import { Navbar } from '@/modules/global/components/navbar';
import { Suspense, type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="w-screen h-screen overflow-hidden flex flex-col">
			<Navbar />
			<Suspense fallback={<></>}>
				<ClientPanels>{children}</ClientPanels>
			</Suspense>
		</div>
	);
};

export default Layout;
