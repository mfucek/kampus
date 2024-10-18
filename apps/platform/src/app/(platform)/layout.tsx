import { ClientPanels } from '@/global/components/client-panels';
import { Navbar } from '@/global/components/navbar';
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
