import { Navbar } from '@/global/components/navbar';
import { ClientPanels } from '@/modules/discussion-panel/components/client-panels';
import { Suspense, type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-screen h-screen overflow-hidden">
				<Navbar />
				<Suspense fallback={<></>}>
					<ClientPanels>{children}</ClientPanels>
				</Suspense>
			</div>
		</>
	);
};

export default Layout;
