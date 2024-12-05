import { createTRPCRouter } from '@/server/api/trpc';

import { getByIdProcedure } from './procedures/get-by-id';
import { getBySlugProcedure } from './procedures/get-by-slug';
import { listSubjectsProcedure } from './procedures/get-subjects';
import { listProcedure } from './procedures/list';

export const programRouter = createTRPCRouter({
	list: listProcedure,
	getById: getByIdProcedure,
	getBySlug: getBySlugProcedure,
	listSubjects: listSubjectsProcedure
});
