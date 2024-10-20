import { College } from '@prisma/client';
import Image from 'next/image';
import { FC } from 'react';

export const CollegeCard: FC<{ college: College }> = ({ college }) => {
	return (
		<div className="p-4 md:p-6 flex flex-row gap-2 rounded-xl bg-neutral-weak items-center clickable h-full">
			<div className="h-12 w-12 shrink-0 rounded-[12px] bg-neutral-medium border border-neutral-weak overflow-hidden">
				<Image
					src={college.iconSrc ?? 'https://picsum.photos/48/48'}
					alt={college.name}
					width={48}
					height={48}
				/>
			</div>
			<span className="flex-1 button-md">{college.name}</span>
		</div>
	);
};
