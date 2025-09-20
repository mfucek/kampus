import { createTRPCRouter } from '@/deps/trpc/trpc';

import { listProcedure } from '@/modules/account/api/procedures/list';
import { updateBadgeProcedure } from '../../user/api/procedures/badge/update-badge-procedure';
import { updateNameProcedure } from '../../user/api/procedures/name/update-name';
import { hasPermissionProcedure } from '../../user/api/procedures/permission/has-permission';
import { getUploadUrlProcedure } from '../../user/api/procedures/profile-picture/get-upload-url';
import { getUserProfilePictureUrlProcedure } from '../../user/api/procedures/profile-picture/get-user-profile-picture-url';
import { uploadProfilePictureProcedure } from '../../user/api/procedures/profile-picture/upload-profile-picture';
import { getAccoutProcedure } from './procedures/get-account';
import { getCurrentUserProcedure } from './procedures/get-current-user';
import { getCurrentUserIdProcedure } from './procedures/get-current-user-id';
import { getCurrentUserProfilePictureUrlProcedure } from './procedures/get-current-user-profile-picture-url';
import { getUserProcedure } from './procedures/get-user';

export const accountRouter = createTRPCRouter({
	list: listProcedure,
	getAccount: getAccoutProcedure,
	getCurrentUserId: getCurrentUserIdProcedure,
	getCurrentUser: getCurrentUserProcedure,
	getUser: getUserProcedure,
	updateDisplayName: updateNameProcedure,
	updateBadge: updateBadgeProcedure,
	uploadProfilePicture: uploadProfilePictureProcedure,
	getUploadUrl: getUploadUrlProcedure,
	getCurrentUserProfilePictureUrl: getCurrentUserProfilePictureUrlProcedure,
	getUserProfilePictureUrl: getUserProfilePictureUrlProcedure,
	hasPermission: hasPermissionProcedure
});
