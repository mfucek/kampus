import { createTRPCRouter } from '@/server/api/trpc';

import { getByIdProcedure } from './procedures/get-by-id';
import { getBySlugProcedure } from './procedures/get-by-slug';
import { hasDocumentOfKindProcedure } from './procedures/has-document-of-kind';
import { listProcedure } from './procedures/list';
import { listStaffProcedure } from './procedures/list-staff';

export const subjectRouter = createTRPCRouter({
	getById: getByIdProcedure,
	getBySlug: getBySlugProcedure,
	list: listProcedure,
	listStaff: listStaffProcedure,
	hasDocumentOfKindProcedure: hasDocumentOfKindProcedure
});
