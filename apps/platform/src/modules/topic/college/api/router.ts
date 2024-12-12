import { createTRPCRouter } from '@/server/api/trpc';

import { getByIdProcedure } from './procedures/get-by-id';
import { getBySlugProcedure } from './procedures/get-by-slug-procedure';
import { listAllProcedure } from './procedures/list-all';
import { listProgramsProcedure } from './procedures/list-programs';
import { listTopCollegesProcedure } from './procedures/list-top-colleges';

export const collegeRouter = createTRPCRouter({
	listAll: listAllProcedure,
	getBySlug: getBySlugProcedure,
	getById: getByIdProcedure,
	listPrograms: listProgramsProcedure,
	listTopColleges: listTopCollegesProcedure
});
