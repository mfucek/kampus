'use client';

import { api } from '@/lib/trpc/react';
import { type RuleType } from '@prisma/client';
import { type FC, type PropsWithChildren, type ReactNode } from 'react';

export const RuleProtected: FC<
	{
		denied?: ReactNode;
		rule: RuleType;
		scopeId?: string;
	} & PropsWithChildren
> = ({ children, denied, rule, scopeId }) => {
	const { data: canAccess } = api.account.hasPermission.useQuery({
		rule,
		scopeId
	});

	if (!canAccess) {
		return <>{denied ?? null}</>;
	}

	return <>{children}</>;
};
