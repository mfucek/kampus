'use client';

import { PosthogProvider } from '@/deps/posthog';
import { TRPCReactProvider } from '@/deps/trpc/react';
import { ViewportSizeProvider } from '@/deps/viewport-size';
import { ThemeProvider } from '@/lib/theme/providers/theme-provider';
import { LayoutProvider } from '@/modules/layout/contexts/use-layout';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<TRPCReactProvider>
			<PosthogProvider>
				<ViewportSizeProvider>
					<ThemeProvider>
						<LayoutProvider>{children}</LayoutProvider>
					</ThemeProvider>
				</ViewportSizeProvider>
			</PosthogProvider>
		</TRPCReactProvider>
	);
};
