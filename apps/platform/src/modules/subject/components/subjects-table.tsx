'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type FC } from 'react';

type Subject = {
	topic: {
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
	};
	topicId: string;
	semester: number | null;
	ects: number | null;
};

export const columns: ColumnDef<Subject>[] = [
	{
		accessorKey: 'topic.name',
		header: 'Predmet'
	},
	{
		accessorKey: 'semester',
		header: 'Semestar'
	},
	{
		accessorKey: 'ects',
		header: 'ECTS'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				topic: {
					slug: topicSlug,
					college: { slug: collegeSlug }
				}
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/subject/${topicSlug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="chat-single" />3 topics
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
