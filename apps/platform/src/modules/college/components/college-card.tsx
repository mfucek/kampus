import Image from 'next/image';
import { FC } from 'react';

type College = {
	imgSrc: string;
	name: string;
	slug: string;
};

export const CollegeCard: FC<{ college: College }> = ({ college }) => {
	return (
		<div className="p-6 flex flex-row gap-2 rounded-lg border border-neutral-weak items-center clickable">
			<div className="h-12 w-12 shrink-0 rounded-[12px] bg-neutral-weak border border-neutral-weak overflow-hidden">
				<Image src={college.imgSrc} alt={college.name} width={48} height={48} />
			</div>
			<span className="flex-1 button-md">{college.name}</span>
		</div>
	);
};
