'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { type FC, type PropsWithChildren } from 'react';

import { env } from '@/env';

const posthog_key = 'phc_ja1RmkJI17SjamUr0rDmMmjyw8GlezvHlYm05tGCDFv';
const posthog_host = 'https://us.i.posthog.com';

const isProduction = env.NEXT_PUBLIC_DEPLOYMENT === 'production';

if (typeof window !== 'undefined' && isProduction) {
	posthog.init(posthog_key, {
		api_host: posthog_host,
		capture_pageview: true // Disable automatic pageview capture, as we capture manually
	});
}

export const useCaptureEvent = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (!isProduction || typeof window === 'undefined') {
		return {
			capture: (...params: any[]) => {
				console.log('[Capture]', params);
			}
		};
	}

	const capture = (name: string, properties: Record<string, any>) => {
		if (window && pathname) {
			let url = window.origin + pathname;
			if (searchParams?.toString()) {
				url = url + `?${searchParams.toString()}`;
			}
			posthog.capture(name, { url, ...properties });
		}
	};

	return { capture };
};

export const AnalyticsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	if (!isProduction) {
		return <>{children}</>;
	}

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
