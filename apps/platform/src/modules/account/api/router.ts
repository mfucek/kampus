import { createTRPCRouter } from '@/server/api/trpc';

import { getAccoutProcedure } from './procedures/get-account';
import { getCurrentUserProfilePictureUrlProcedure } from './procedures/get-current-user-profile-picture-url';
import { getUploadUrlProcedure } from './procedures/get-upload-url';
import { getUserProcedure } from './procedures/get-user';
import { getUserProfilePictureUrlProcedure } from './procedures/get-user-profile-picture-url';
import { updateBadgeProcedure } from './procedures/update-badge-procedure';
import { updateDisplayNameProcedure } from './procedures/update-display-name';
import { uploadProfilePictureProcedure } from './procedures/upload-profile-picture';

export const accountRouter = createTRPCRouter({
	getAccount: getAccoutProcedure,
	getUser: getUserProcedure,
	updateDisplayName: updateDisplayNameProcedure,
	updateBadge: updateBadgeProcedure,
	uploadProfilePicture: uploadProfilePictureProcedure,
	getUploadUrl: getUploadUrlProcedure,
	getCurrentUserProfilePictureUrl: getCurrentUserProfilePictureUrlProcedure,
	getUserProfilePictureUrl: getUserProfilePictureUrlProcedure
});
