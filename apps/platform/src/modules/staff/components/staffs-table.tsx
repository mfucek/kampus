'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Staff = {
	id: string;
	name: string;
	slug: string;
};

export const payments: Staff[] = [
	{
		id: '728ed52f',
		name: 'Miljenko Mikic',
		slug: 'miljenko-mikic'
	},
	{
		id: '489e1d42',
		name: 'Miljenko Mikic',
		slug: 'miljenko-mikic'
	}
];

export const columns: ColumnDef<Staff>[] = [
	{
		accessorKey: 'name',
		header: 'Ime'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const { slug } = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/fer/staff/${slug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="chat-single" />2 topics
						</Button>
					</Link>
				</div>
			);
		}
	}
];

export const StaffsTable = () => {
	return <DataTable columns={columns} data={payments} loading={false} />;
};
