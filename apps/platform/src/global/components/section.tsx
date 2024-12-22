'use client';

import { type FC, type PropsWithChildren } from 'react';

export const Section: FC<
	PropsWithChildren & {
		title: string;
		description?: string;
		id?: string;
	}
> = ({ children, title, description, id }) => {
	return (
		<div className="flex flex-col @sm:flex-row gap-10" id={id}>
			<div className="flex flex-col gap-2 @sm:w-[400px]">
				<p className="title-3 text-neutral">{title}</p>
				<p className="body-2 text-neutral-strong">{description}</p>
			</div>
			{children && (
				<div className="flex flex-col gap-10 flex-1">{children}</div>
			)}
		</div>
	);
};
