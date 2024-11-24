import { type FC, type PropsWithChildren } from 'react';

import { cn } from '@/lib/shadcn/utils';

export const Container: FC<
	PropsWithChildren<{ className?: string; wide?: boolean }>
> = ({ children, className, wide = false }) => {
	return (
		<div
			className={cn(
				'w-full px-4 md:px-10 @container flex flex-col gap-10',
				wide ? 'max-w-[1200px]' : 'max-w-[800px]',
				className
			)}
		>
			{children}
		</div>
	);
};
