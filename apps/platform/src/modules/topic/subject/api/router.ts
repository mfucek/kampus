import { createTRPCRouter } from '@/deps/trpc/trpc';

import { listStaffProcedure } from '../../api/procedures/staff/list-by-subject-id';
import { getByIdProcedure } from '../../api/procedures/subject/get-by-id';
import { getBySlugProcedure } from '../../api/procedures/subject/get-by-slug';
import { hasDocumentOfKindProcedure } from '../../api/procedures/subject/has-document-of-kind';
import { listProcedure } from '../../api/procedures/subject/list-paginated';

export const subjectRouter = createTRPCRouter({
	getById: getByIdProcedure,
	getBySlug: getBySlugProcedure,
	list: listProcedure,
	listStaff: listStaffProcedure,
	hasDocumentOfKindProcedure: hasDocumentOfKindProcedure
});
