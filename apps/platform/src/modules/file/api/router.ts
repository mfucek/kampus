import { createTRPCRouter } from '@/server/api/trpc';

import { getDocumentProcedure } from './procedures/get-document';
import { getImageProcedure } from './procedures/get-image';
import { linkToPostProcedure } from './procedures/link-to-post';
import { listByPostProcedure } from './procedures/list-by-post';
import { listDocumentsProcedure } from './procedures/list-documents';
import { makeUploadUrlProcedure } from './procedures/make-upload-url';

export const fileRouter = createTRPCRouter({
	listDocuments: listDocumentsProcedure,
	getImage: getImageProcedure,
	getDocument: getDocumentProcedure,
	listByPost: listByPostProcedure,
	makeUploadUrl: makeUploadUrlProcedure,
	linkToPost: linkToPostProcedure
});
