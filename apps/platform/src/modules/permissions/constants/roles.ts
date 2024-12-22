import { RoleType, RuleType } from '@prisma/client';

export const rolePermissions: Record<RoleType, Record<RuleType, boolean>> = {
	[RoleType.BASE]: {
		[RuleType.CAN_POST]: true,
		[RuleType.CAN_CHANGE_PROFILE_BADGE]: false,
		[RuleType.CAN_MASS_UPLOAD]: false,
		[RuleType.CAN_MANAGE_USERS]: false
	},
	[RoleType.ADMINISTRATOR]: {
		[RuleType.CAN_POST]: true,
		[RuleType.CAN_CHANGE_PROFILE_BADGE]: true,
		[RuleType.CAN_MASS_UPLOAD]: true,
		[RuleType.CAN_MANAGE_USERS]: true
	}
};
