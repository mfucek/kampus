import { createTRPCRouter } from '@/deps/trpc/trpc';

import { getBySlugProcedure } from './procedures/get-by-slug';
import { listProcedure } from './procedures/list';

export const staffRouter = createTRPCRouter({
	list: listProcedure,
	getBySlug: getBySlugProcedure
});
