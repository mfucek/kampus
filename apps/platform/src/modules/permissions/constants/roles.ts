import { type Permissions, RoleType } from '@prisma/client';

export const rolePermissions: Record<
	RoleType,
	Omit<Permissions, 'accountId' | 'baseRole' | 'account'>
> = {
	[RoleType.BASE]: {
		canEnterPlatform: true,
		canPost: true,
		canReply: true,
		canVote: true,
		canUploadFiles: true,
		canUploadImages: true,
		canChangeTheme: false,
		canViewAllSummaries: false,
		canSuggestTopics: true,
		canApproveTopics: false,
		canManageTopics: false,
		canManageColleges: false,
		canDeleteOthersPosts: false,
		canDeleteUsers: false,
		canManageUserRoles: false,
		canManagePermissions: false
	},
	[RoleType.MODERATOR]: {
		canEnterPlatform: true,
		canPost: true,
		canReply: true,
		canVote: true,
		canUploadFiles: true,
		canUploadImages: true,
		canChangeTheme: true,
		canViewAllSummaries: true,
		canSuggestTopics: true,
		canApproveTopics: true,
		canManageTopics: true,
		canManageColleges: true,
		canDeleteOthersPosts: true,
		canDeleteUsers: false,
		canManageUserRoles: false,
		canManagePermissions: false
	},
	[RoleType.ADMIN]: {
		canEnterPlatform: true,
		canPost: true,
		canReply: true,
		canVote: true,
		canUploadFiles: true,
		canUploadImages: true,
		canChangeTheme: true,
		canViewAllSummaries: true,
		canSuggestTopics: true,
		canApproveTopics: true,
		canManageTopics: true,
		canManageColleges: true,
		canDeleteOthersPosts: true,
		canDeleteUsers: true,
		canManageUserRoles: true,
		canManagePermissions: true
	}
};
