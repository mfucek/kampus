'use client';

import { PosthogProvider } from '@/lib/posthog';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { ThemeProvider } from '@/modules/theme/providers/theme-provider';
import { ViewportSizeProvider } from '@/utils/useMediaQuery';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<TRPCReactProvider>
			<PosthogProvider>
				<ViewportSizeProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</ViewportSizeProvider>
			</PosthogProvider>
		</TRPCReactProvider>
	);
};
