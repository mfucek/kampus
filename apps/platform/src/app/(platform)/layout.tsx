import { Navbar } from '@/global/components/navbar';
import { ClientPanels } from '@/modules/discussion-panel/components/client-panels';
import { PostIdProvider } from '@/modules/discussion-panel/components/post-id-provider';
import { Suspense, type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-screen h-screen md:overflow-hidden">
				<Navbar />
				<Suspense fallback={<></>}>
					<PostIdProvider>
						<ClientPanels>{children}</ClientPanels>
					</PostIdProvider>
				</Suspense>
			</div>
		</>
	);
};

export default Layout;
