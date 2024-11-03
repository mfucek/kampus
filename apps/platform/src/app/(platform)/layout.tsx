import { Spinner } from '@/global/components/spinner';
import { Navbar } from '@/global/molecules/navbar/navbar';
import { ClientPanels } from '@/modules/discussion-panel/components/client-panels';
import { PostIdProvider } from '@/modules/discussion-panel/components/post-id-provider';
import { Suspense, type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-screen h-screen md:overflow-hidden">
				<Navbar />
				<Suspense
					fallback={
						<>
							<div className="bg-background md:p-2 w-full h-full animate-pulse">
								<div className="rounded-lg bg-section flex flex-col items-center justify-center min-h-full">
									<Spinner className="w-10 h-10" />
								</div>
							</div>
						</>
					}
				>
					<PostIdProvider>
						<ClientPanels>{children}</ClientPanels>
					</PostIdProvider>
				</Suspense>
			</div>
		</>
	);
};

export default Layout;
