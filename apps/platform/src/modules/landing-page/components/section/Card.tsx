'use client';
import { IconSizeContext } from '@/lib/shadcn/ui/button';
import { FC, PropsWithChildren } from 'react';

export const Card: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="p-10 rounded-xl bg-section flex flex-col gap-4 justify-between">
			{children}
		</div>
	);
};

export const CardHeader: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-col gap-2 mb-2">
			<IconSizeContext.Provider value={24}>{children}</IconSizeContext.Provider>
		</div>
	);
};

export const CardTitle: FC<PropsWithChildren> = ({ children }) => {
	return <div className="flex flex-row gap-2 title-2">{children}</div>;
};

export const CardContent: FC<PropsWithChildren> = ({ children }) => {
	return <div className="text-neutral-strong">{children}</div>;
};
