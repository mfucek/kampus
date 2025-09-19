import '@/styles/colors.css';
import '@/styles/globals.css';
import '@/styles/typography.css';

import '@/styles/tiptap.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { PWANavbar } from '@/global/components/pwa-navbar';
import { isDevOrStg } from '@/lib/environment';
import { BodyOverlays } from './body-overlays';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Kampus.hr | Platforma za sve studente',
	description:
		'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
	icons: [
		{ rel: 'icon', url: isDevOrStg ? '/favicon-dev.png' : '/favicon.png' }
	],
	openGraph: {
		title: 'Kampus.hr | Platforma za sve studente',
		description:
			'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
		url: 'https://kampus.hr',
		type: 'website',
		siteName: 'Kampus.hr',
		images: [
			{
				url: 'https://kampus.hr/cover.png',
				width: 1200,
				height: 630
			}
		],
		locale: 'hr-HR'
	}
};

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Providers>
			<html lang="hr-HR" className={GeistSans.variable}>
				<body className="bg-background min-h-screen bg-opacity-100 overscroll-none">
					<BodyOverlays>
						<div className="min-h-screen overflow-x-hidden">{children}</div>
						<PWANavbar />
					</BodyOverlays>
				</body>
			</html>
		</Providers>
	);
}
