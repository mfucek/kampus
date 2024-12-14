import { createTRPCRouter } from '@/server/api/trpc';

import { getAccoutProcedure } from './procedures/get-account';
import { getCurrentUserIdProcedure } from './procedures/get-current-user';
import { getCurrentUserProfilePictureUrlProcedure } from './procedures/get-current-user-profile-picture-url';
import { getUploadUrlProcedure } from './procedures/get-upload-url';
import { getUserProcedure } from './procedures/get-user';
import { getUserProfilePictureUrlProcedure } from './procedures/get-user-profile-picture-url';
import { hasPermissionProcedure } from './procedures/has-permission';
import { updateBadgeProcedure } from './procedures/update-badge-procedure';
import { updateDisplayNameProcedure } from './procedures/update-display-name';
import { uploadProfilePictureProcedure } from './procedures/upload-profile-picture';

export const accountRouter = createTRPCRouter({
	getAccount: getAccoutProcedure,
	getCurrentUserId: getCurrentUserIdProcedure,
	getUser: getUserProcedure,
	updateDisplayName: updateDisplayNameProcedure,
	updateBadge: updateBadgeProcedure,
	uploadProfilePicture: uploadProfilePictureProcedure,
	getUploadUrl: getUploadUrlProcedure,
	getCurrentUserProfilePictureUrl: getCurrentUserProfilePictureUrlProcedure,
	getUserProfilePictureUrl: getUserProfilePictureUrlProcedure,
	hasPermission: hasPermissionProcedure
});
