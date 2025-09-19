import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { createCaller, type AppRouter } from '@/deps/trpc/root';
import { createTRPCContext } from '@/deps/trpc/trpc';
import { createQueryClient } from './query-client';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
	return createTRPCContext({
		headers: new Headers({
			cookie: (await cookies()).toString(),
			'x-trpc-source': 'rsc'
		})
		// auth: getAuth(
		// 	new NextRequest('https://notused.com', {
		// 		headers: headers() as unknown as UnsafeUnwrappedHeaders
		// 	})
		// )
	});
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient
);
