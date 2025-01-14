import '@/styles/colors.css';
import '@/styles/globals.css';
import '@/styles/typography.css';

import '@/styles/tiptap.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { AnalyticsProvider } from '@/lib/posthog';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '../modules/theme/providers/theme-provider';

import { isDevOrStg } from '@/constants/is-dev-or-staging';
import { PWANavbar } from '@/global/components/pwa-navbar';
import { Toaster } from '@/lib/shadcn/ui/toaster';
import { ViewportSizeProvider } from '@/utils/useMediaQuery';
import NextTopLoader from 'nextjs-toploader';

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
		<html lang="en" className={GeistSans.variable}>
			<body className="bg-background min-h-screen bg-opacity-100 overscroll-none">
				<NextTopLoader color="#3461ff" shadow={false} showSpinner={false} />
				<ClerkProvider localization={{ locale: 'hr-HR' }}>
					<TRPCReactProvider>
						<AnalyticsProvider>
							<ViewportSizeProvider>
								<ThemeProvider>
									<div className="min-h-screen overflow-x-hidden">
										{children}
									</div>
									<Toaster />
									<PWANavbar />
								</ThemeProvider>
							</ViewportSizeProvider>
						</AnalyticsProvider>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
