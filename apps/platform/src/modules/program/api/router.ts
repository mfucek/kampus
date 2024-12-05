import { createTRPCRouter } from '@/server/api/trpc';

import { listByDepartmentProcedure } from './procedures/list-by-department';

export const programRouter = createTRPCRouter({
	listByDepartment: listByDepartmentProcedure
});
