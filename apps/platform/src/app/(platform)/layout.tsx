import { SpinnerReloadErrorMessage } from '@/global/components/reload-error-message';
import { Navbar } from '@/global/molecules/navbar/navbar';
import { ClientPanels } from '@/modules/discussion-panel/components/client-panels';
import { PostIdProvider } from '@/modules/discussion-panel/components/post-id-provider';
import { Suspense, type FC, type PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div className="flex flex-col w-full md:h-screen overflow-x-hidden overscroll-x-none">
				<Navbar />
				<Suspense
					fallback={
						<>
							<div className="bg-background md:p-2 w-full md:h-full">
								<div className="rounded-lg bg-section flex flex-col items-center justify-center min-h-full">
									<SpinnerReloadErrorMessage />
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
