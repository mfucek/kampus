'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type FC } from 'react';

type Subject = {
	id: string;
	slug: string;
	name: string;
	collegeId: string;
	college: {
		id: string;
		slug: string;
		name: string;
		iconSrc: string | null;
	};
	subject: {
		topicId: string;
		semester: number | null;
		ects: number | null;
	} | null;
	_count: {
		Post: number;
	};
};

export const columns: ColumnDef<Subject>[] = [
	{
		accessorKey: 'name',
		header: 'Predmet'
	},
	{
		accessorKey: 'subject.semester',
		header: 'Semestar'
	},
	{
		accessorKey: 'subject.ects',
		header: 'ECTS'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				slug: topicSlug,
				college: { slug: collegeSlug },
				_count: { Post: postCount }
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/subject/${topicSlug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="chat-single" />
							{postCount} topics
						</Button>
					</Link>
				</div>
			);
		}
	}
];

export const SubjectsTable: FC<{ subjects: Subject[] }> = ({ subjects }) => {
	return <DataTable columns={columns} data={subjects} loading={false} />;
};
