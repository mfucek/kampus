import { createTRPCRouter } from '@/server/api/trpc';

import { getByIdProcedure } from './procedures/get-by-id';
import { getBySlugProcedure } from './procedures/get-by-slug';
import { getSubjectsProcedure } from './procedures/get-subjects';
import { listByDepartmentProcedure } from './procedures/list-by-department';

export const programRouter = createTRPCRouter({
	listByDepartment: listByDepartmentProcedure,
	getById: getByIdProcedure,
	getBySlug: getBySlugProcedure,
	getSubjects: getSubjectsProcedure
});
