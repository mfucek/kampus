'use client';

import Link from 'next/link';
import { Fragment, type FC } from 'react';

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
					<Fragment key={index}>
						<Link
							href={link.link}
							className={cn(
								'title-3 text-neutral-strong md:hover:text-neutral duration-200',
								'max-w-[96px] truncate'
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
					</Fragment>
				);
			})}
		</div>
	);
};
