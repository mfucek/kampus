import { createTRPCRouter } from '@/server/api/trpc';

import { getBySlugProcedure } from './procedures/get-by-slug';
import { listProcedure } from './procedures/list';
import { listStaffProcedure } from './procedures/list-staff';

export const subjectRouter = createTRPCRouter({
	list: listProcedure,
	getBySlug: getBySlugProcedure,
	listStaff: listStaffProcedure
});
