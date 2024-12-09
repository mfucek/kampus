'use client';

import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/lib/shadcn/ui/table';
import { type GetSubjectsOutput } from '../api/procedures/get-subjects';

const EXPAND_THRESHOLD = 6;

export const SubjectGroupTable: FC<{
	subjects: GetSubjectsOutput[];
	collegeSlug: string;
	groupName: string;
}> = ({ subjects, collegeSlug, groupName }) => {
	const router = useRouter();

	const [expanded, setExpanded] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<div className="px-3 flex justify-between">
				<div className="text-neutral-strong caption">{groupName}</div>
				<div className="text-neutral-strong caption">
					{subjects.length} predmeta
				</div>
			</div>
			<Table className="table-fixed border-none">
				<TableBody>
					{subjects
						.slice(0, expanded ? undefined : EXPAND_THRESHOLD)
						.map((subject) => (
							<TableRow
								key={subject.id}
								className="bg-neutral-weak cursor-pointer group"
								onClick={() => {
									router.push(`/${collegeSlug}/subject/${subject.slug}`);
								}}
							>
								<TableCell className="w-[180px] button-md">
									{subject.name}
								</TableCell>
								<TableCell className="w-[160px]">
									<p className="truncate w-full caption text-neutral-strong group-hover:text-neutral">
										{subject.staffs
											.map((s) => {
												const words = s.split(' ');
												return `${words[0]![0]}. ${words.slice(1).join(' ')}`;
											})
											.join(', ')}
									</p>
								</TableCell>
								<TableCell className="w-[80px]">
									<p className="truncate w-full caption text-neutral-strong group-hover:text-neutral">
										{subject.ects} ECTS
									</p>
								</TableCell>
								<TableCell className="text-right w-[40px] box-content">
									<Button size="xs" theme="neutral" variant="solid-weak">
										{subject.topLevelPosts}
										<Icon icon="chat-single" />
									</Button>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			{subjects.length > EXPAND_THRESHOLD && (
				<div className="flex w-full justify-center">
					<Button
						onClick={() => setExpanded(!expanded)}
						variant="outline"
						size="sm"
					>
						{expanded ? 'Sakrij' : 'Prikaži sve'}
					</Button>
				</div>
			)}
		</div>
	);
};
