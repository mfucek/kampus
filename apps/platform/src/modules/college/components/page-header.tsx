import { cn } from '@/lib/shadcn/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

export const PageHeader: FC<{
	collegeSlug: string;
	collegeName: string;
	topicName?: string;
	imageSrc?: string;
}> = async ({ collegeSlug, collegeName, topicName, imageSrc }) => {
	if (topicName) {
		return (
			<div className="flex flex-col gap-2 w-full">
				<Link href={`/${collegeSlug}`}>
					<div
						className={cn('flex flex-row items-center gap-2 group clickable')}
					>
						<div
							className={cn(
								'h-6 w-6 rounded-[6px] overflow-hidden relative shrink-0 bg-neutral-weak border border-neutral-weak'
							)}
						>
							{imageSrc && <Image src={imageSrc} alt={collegeName} fill />}
						</div>
						<h1
							className={cn(
								'w-full title-3 text-neutral-strong group-hover:text-neutral'
							)}
						>
							{collegeName}
						</h1>
					</div>
				</Link>
				<h2 className="display-3">{topicName}</h2>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className={cn('flex flex-row items-center gap-3')}>
				<div
					className={cn(
						'w-10 h-10 rounded-xl overflow-hidden relative shrink-0 bg-neutral-weak border border-neutral-weak'
					)}
				>
					{imageSrc && <Image src={imageSrc} alt={collegeName} fill />}
				</div>
				<h1 className={cn('w-full', 'display-3')}>{collegeName}</h1>
			</div>
		</div>
	);
};
