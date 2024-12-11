'use client';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { api } from '@/lib/trpc/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const Breadcrumbs = () => {
	const collegeSlug = useParams().collegeSlug as string;

	const staffSlug = useParams().staffSlug as string;
	const subjectSlug = useParams().subjectSlug as string;
	const topicSlug = staffSlug || subjectSlug;

	const college = api.college.getBySlug.useQuery(
		{ collegeSlug },
		{ enabled: !!collegeSlug }
	);
	const collegeName = college.data?.name;

	const staff = api.staff.getBySlug.useQuery(
		{ collegeSlug, staffSlug },
		{ enabled: !!staffSlug && !!collegeSlug }
	);
	const staffName = staff.data?.name;

	const subject = api.subject.getBySlug.useQuery(
		{ collegeSlug, subjectSlug },
		{ enabled: !!subjectSlug && !!collegeSlug }
	);
	const subjectName = subject.data?.name;

	return (
		<div className="flex flex-row gap-0 items-center">
			{collegeSlug && (
				<>
					<Link href={`/${collegeSlug}`}>
						<div
							className={cn(
								'title-3',
								'max-w-[96px] truncate',
								topicSlug &&
									'text-neutral-strong hover:text-neutral hover:underline'
							)}
						>
							{collegeName ?? collegeSlug}
						</div>
					</Link>
				</>
			)}
			{topicSlug && (
				<>
					<Icon icon="chevron-right" className="bg-neutral-strong" size={20} />
					<div className={cn('title-3', 'max-w-[96px] truncate')}>
						{staffName ?? subjectName ?? topicSlug}
					</div>
				</>
			)}
		</div>
	);
};
