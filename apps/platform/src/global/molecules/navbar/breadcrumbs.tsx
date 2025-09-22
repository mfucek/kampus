'use client';

import Link from 'next/link';
import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';

export type Breadcrumb = {
	title: string;
	link: string;
};

export const Breadcrumbs: FC<{ links: Breadcrumb[] }> = ({ links }) => {
	return (
		<div className="flex flex-row gap-0 items-center">
			{links.map((link, index) => {
				const isLast = index === links.length - 1;

				return (
					<>
						<Link
							href={link.link}
							className={cn(
								'title-3 text-neutral-medium md:hover:text-neutral duration-200',
								'max-w-[96px] truncate',
								isLast && 'text-neutral-strong'
							)}
						>
							{link.title}
						</Link>

						{!isLast && (
							<Icon
								icon="chevron-right"
								className="bg-neutral-medium"
								size={20}
							/>
						)}
					</>
				);
			})}
		</div>
	);
};
