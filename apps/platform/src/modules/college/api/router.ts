import { createTRPCRouter } from '@/server/api/trpc';
import { getBySlugProcedure } from './procedures/get-by-slug-procedure';
import { listAllProcedure } from './procedures/list-all';

export const collegeRouter = createTRPCRouter({
	listAll: listAllProcedure,
	getBySlug: getBySlugProcedure
});
