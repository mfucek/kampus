import { createTRPCRouter } from '@/deps/trpc/trpc';

import { getBySlugProcedure } from '../../api/procedures/staff/get-by-slug';
import { listProcedure } from '../../api/procedures/staff/list-paginated';

export const staffRouter = createTRPCRouter({
	list: listProcedure,
	getBySlug: getBySlugProcedure
});
