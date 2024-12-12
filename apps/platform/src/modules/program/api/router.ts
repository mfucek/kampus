import { createTRPCRouter } from '@/server/api/trpc';

import { getByIdProcedure } from './procedures/get-by-id';
import { getBySlugProcedure } from './procedures/get-by-slug';
import { listSubjectsProcedure } from './procedures/list-subjects';

export const programRouter = createTRPCRouter({
	getById: getByIdProcedure,
	getBySlug: getBySlugProcedure,
	listSubjects: listSubjectsProcedure
});
