'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { StaffGetItem } from '../../api/procedures/staff/get-by-id';

export const columns: ColumnDef<StaffGetItem>[] = [
	{
		accessorKey: 'topic.name',
		header: 'Ime'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				topic: { slug: staffSlug },
				college: {
					topic: { slug: collegeSlug }
				},
				postsCount
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/staff/${staffSlug}`}>
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

export const StaffsTable: FC<{
	staffs: StaffGetItem[];
	loading?: boolean;
}> = ({ staffs, loading = false }) => {
	return <DataTable columns={columns} data={staffs} loading={loading} />;
};
