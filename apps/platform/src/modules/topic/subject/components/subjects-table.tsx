'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type FC } from 'react';
import { SubjectGetItem } from '../../api/procedures/subject/get-by-id';

export const columns: ColumnDef<SubjectGetItem>[] = [
	{
		accessorKey: 'topic.name',
		header: 'Predmet'
	},
	{
		accessorKey: 'subject.ects',
		header: 'ECTS'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				topic: { slug: topicSlug },
				college: {
					topic: { slug: collegeSlug }
				},
				postsCount
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/subject/${topicSlug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							{postsCount}
							<Icon icon="chat-single" />
						</Button>
					</Link>
				</div>
			);
		}
	}
];

export const SubjectsTable: FC<{
	subjects: SubjectGetItem[];
	loading?: boolean;
}> = ({ subjects, loading = false }) => {
	return <DataTable columns={columns} data={subjects} loading={loading} />;
};
