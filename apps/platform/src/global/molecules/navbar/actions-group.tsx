'use client';
import type { FC, PropsWithChildren } from 'react';

export const ActionsGroup: FC<PropsWithChildren> = ({ children }) => {
	return <div className="flex flex-row gap-2 items-center">{children}</div>;
};
