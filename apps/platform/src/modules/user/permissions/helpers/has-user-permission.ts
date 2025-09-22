import { db } from '@/deps/prisma';
import { type RuleType, ScopeType } from '@prisma/client';
import { rolePermissions } from '../constants/roles';

export const hasUserPermission = async (
	userId: string,
	rule: RuleType,
	scopeId?: string
) => {
	const user = await db.user.findUnique({
		where: {
			id: userId
		},
		include: {
			Permissions: true
		}
	});

	if (!user) return false;

	// default role permission
	const roleValue = rolePermissions[user.role][rule];

	// rule override
	const permissions = user.Permissions;
	const permission = permissions.find((permission) => permission.rule);

	// if no permission overrides, return role value
	if (!permission) return roleValue;

	const permissionValue = permission.value;
	const permissionScopeType = permission.scopeType;
	const permissionScopeId = permission.scopeId;

	// global applies everywhere
	if (permissionScopeType === ScopeType.GLOBAL) return permissionValue;

	// if permission.scopeId matches topicId, return permissionValue
	if (permissionScopeId === scopeId) return permissionValue;

	// if topic (scopeId) is related to college (permissionScopeId), return permissionValue
	if (permissionScopeType === ScopeType.COLLEGE) {
		const a = await db.topic.count({
			where: {
				College: {
					topicId: permissionScopeId!
				}
			}
		});

		if (a > 0) return permissionValue;
	}

	return roleValue;
};
