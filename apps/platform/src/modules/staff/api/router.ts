import { createTRPCRouter } from '@/server/api/trpc';

import { getBySlugProcedure } from '@/modules/college/api/procedures/get-by-slug-procedure';
import { listProcedure } from './procedures/list';

export const staffRouter = createTRPCRouter({
	list: listProcedure,
	getBySlug: getBySlugProcedure
});
