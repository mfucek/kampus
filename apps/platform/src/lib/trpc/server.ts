import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cookies, headers, type UnsafeUnwrappedCookies, type UnsafeUnwrappedHeaders } from 'next/headers';
import { cache } from 'react';

import { createCaller, type AppRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { createQueryClient } from './query-client';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
	return createTRPCContext({
		headers: new Headers({
			cookie: (cookies() as unknown as UnsafeUnwrappedCookies).toString(),
			'x-trpc-source': 'rsc'
		}),
		auth: getAuth(
			new NextRequest('https://notused.com', { headers: (headers() as unknown as UnsafeUnwrappedHeaders) })
		)
	});
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient
);
