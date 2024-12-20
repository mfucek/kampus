import { db } from '@/lib/prisma/db';
import { RuleType, ScopeType } from '@prisma/client';
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
			Account: {
				include: {
					Permissions: true
				}
			}
		}
	});

	if (!user?.Account) return false;

	// default role permission
	const roleValue = rolePermissions[user.Account.role][rule];

	// rule override
	const permissions = user.Account.Permissions;
	const permission = permissions.find((permission) => permission.rule);

	console.log(scopeId, permissions);
	if (!permission) return roleValue;

	const permissionValue = permission.value;
	const permissionScopeType = permission.scopeType;
	const permissionScopeId = permission.scopeId;

	if (permissionScopeType === ScopeType.GLOBAL) return permissionValue;
	if (permissionScopeId === scopeId) return permissionValue;

	return roleValue;
};
