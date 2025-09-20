import '@/styles/index.css';

import { GeistSans } from 'geist/font/sans';

import { metadata } from '@/lib/metadata';
import { PWANavbar } from '@/modules/layout/components/pwa-navbar';
import { BodyOverlays } from './body-overlays';
import { Providers } from './providers';

export { metadata };

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Providers>
			<html lang="hr-HR" className={GeistSans.variable}>
				<body className="bg-background min-h-screen overscroll-none">
					<BodyOverlays>
						<div className="min-h-screen overflow-x-hidden">{children}</div>
						<PWANavbar />
					</BodyOverlays>
				</body>
			</html>
		</Providers>
	);
}
