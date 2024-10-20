'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Payment = {
	id: string;
	title: string;
	slug: string;
	semester: number;
	ects: number;
};

export const payments: Payment[] = [
	{
		id: '728ed52f',
		title: 'Programiranje 1',
		slug: 'programiranje-1',
		semester: 1,
		ects: 5
	},
	{
		id: '489e1d42',
		title: 'Programiranje 2',
		slug: 'programiranje-2',
		semester: 2,
		ects: 5
	}
];

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'title',
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
			const { slug } = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/fer/subject/${slug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="chat-single" />3 topics
						</Button>
					</Link>
				</div>
			);
		}
	}
];

export const SubjectsTable = () => {
	return <DataTable columns={columns} data={payments} loading={false} />;
};
