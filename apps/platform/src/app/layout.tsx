import '@/styles/colors.css';
import '@/styles/globals.css';
import '@/styles/tiptap.css';
import '@/styles/typography.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { AnalyticsProvider } from '@/lib/posthog';
import { TooltipProvider } from '@/lib/shadcn/ui/tooltip';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '../modules/theme/providers/theme-provider';

import { Toaster } from '@/lib/shadcn/ui/toaster';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
	title: 'Kampus.hr | Platforma za sve studente',
	description:
		'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
	icons: [{ rel: 'icon', url: '/favicon.png' }]
};

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={GeistSans.variable}>
			<body className="bg-background min-h-screen">
				<NextTopLoader color="#3461ff" shadow={false} showSpinner={false} />
				<ClerkProvider localization={{ locale: 'hr-HR' }}>
					<TRPCReactProvider>
						<AnalyticsProvider>
							<ThemeProvider>
								<TooltipProvider>
									{children}
									<Toaster />
								</TooltipProvider>
							</ThemeProvider>
						</AnalyticsProvider>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
