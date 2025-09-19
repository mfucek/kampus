import { createTRPCRouter } from '@/deps/trpc/trpc';

import { updateBadgeProcedure } from '@/modules/user/api/procedures/badge/update-badge-procedure';
import { updateDisplayNameProcedure } from '@/modules/user/api/procedures/name/update-display-name';
import { hasPermissionProcedure } from '@/modules/user/api/procedures/permission/has-permission';
import { getUploadUrlProcedure } from '@/modules/user/api/procedures/profile-picture/get-upload-url';
import { uploadProfilePictureProcedure } from '@/modules/user/api/procedures/profile-picture/upload-profile-picture';
import { getUserProcedure } from './procedures/get';
import { listProcedure } from './procedures/list';
import { addProcedure as addPermissionsProcedure } from './procedures/permission/add';
import { listProcedure as listPermissionsProcedure } from './procedures/permission/list';
import { removeProcedure as removePermissionsProcedure } from './procedures/permission/remove';
import { getCurrentUserProfilePictureUrlProcedure } from './procedures/profile-picture/get-current-user-profile-picture-url';
import { getUserProfilePictureUrlProcedure } from './procedures/profile-picture/get-user-profile-picture-url';

export const userRouter = createTRPCRouter({
	get: getUserProcedure,
	list: listProcedure,
	profilePicture: createTRPCRouter({
		sessionUser: createTRPCRouter({
			getUrl: getCurrentUserProfilePictureUrlProcedure
		}),
		getUrl: getUserProfilePictureUrlProcedure,
		getUploadUrl: getUploadUrlProcedure,
		uploadProfilePicture: uploadProfilePictureProcedure
	}),
	badge: createTRPCRouter({
		update: updateBadgeProcedure
	}),
	name: createTRPCRouter({
		update: updateDisplayNameProcedure
	}),
	permissions: createTRPCRouter({
		list: listPermissionsProcedure,
		add: addPermissionsProcedure,
		remove: removePermissionsProcedure,
		hasPermission: hasPermissionProcedure
	})
});
