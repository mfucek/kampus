import { cn } from '@/lib/shadcn/utils';
import Image from 'next/image';
import { FC } from 'react';

export const PageHeader: FC<{
	title: string;
	subtitle?: string;
	icon?: string;
}> = ({ title, subtitle, icon }) => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<div
				className={cn(
					'flex flex-row items-center',
					!subtitle ? 'gap-3' : 'gap-2'
				)}
			>
				<div
					className={cn(
						!subtitle ? 'w-10 h-10 rounded-xl' : 'h-6 w-6 rounded-[6px]',
						'overflow-hidden relative shrink-0 bg-neutral-weak border border-neutral-weak'
					)}
				>
					{icon && <Image src={icon} alt={title} fill />}
				</div>
				<h1
					className={cn(
						'w-full',
						!subtitle ? 'display-3' : 'title-3 text-neutral-strong'
					)}
				>
					{title}
				</h1>
			</div>
			{subtitle && <h2 className="display-3">{subtitle}</h2>}
		</div>
	);
};
