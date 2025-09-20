import '@/styles/index.css';

import { GeistSans } from 'geist/font/sans';

import { PWANavbar } from '@/global/components/pwa-navbar';
import { metadata } from '@/lib/metadata';
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
