import { createTRPCRouter } from '@/server/api/trpc';

import { listProcedure } from '@/modules/account/api/procedures/list';
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

import { addProcedure } from '@/modules/permissions/api/procedures/add';
import { listProcedure as listPermissionsProcedure } from '@/modules/permissions/api/procedures/list';
import { removeProcedure } from '@/modules/permissions/api/procedures/remove';

export const accountRouter = createTRPCRouter({
	list: listProcedure,
	getAccount: getAccoutProcedure,
	getCurrentUserId: getCurrentUserIdProcedure,
	getUser: getUserProcedure,
	updateDisplayName: updateDisplayNameProcedure,
	updateBadge: updateBadgeProcedure,
	uploadProfilePicture: uploadProfilePictureProcedure,
	getUploadUrl: getUploadUrlProcedure,
	getCurrentUserProfilePictureUrl: getCurrentUserProfilePictureUrlProcedure,
	getUserProfilePictureUrl: getUserProfilePictureUrlProcedure,
	hasPermission: hasPermissionProcedure,
	permissions: createTRPCRouter({
		list: listPermissionsProcedure,
		add: addProcedure,
		remove: removeProcedure
	})
});
