'use client';

import { api } from '@/lib/trpc/react';
import { RuleType } from '@prisma/client';
import { FC, PropsWithChildren, ReactNode } from 'react';

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
