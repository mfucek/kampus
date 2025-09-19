import { createTRPCRouter } from '@/lib/trpc/trpc';

import { linkToPostProcedure } from './procedures/link-to-post';
import { listByPostProcedure } from './procedures/list-by-post';
import { listDocumentsProcedure } from './procedures/list-documents';
import { makeUploadUrlProcedure } from './procedures/make-upload-url';

export const fileRouter = createTRPCRouter({
	listDocuments: listDocumentsProcedure,
	listByPost: listByPostProcedure,
	makeUploadUrl: makeUploadUrlProcedure,
	linkToPost: linkToPostProcedure
});
