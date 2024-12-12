'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';

type Staff = {
	slug: string;
	college: {
		slug: string;
	};
	_count: {
		posts: number;
	};
};

export const columns: ColumnDef<Staff>[] = [
	{
		accessorKey: 'name',
		header: 'Ime'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				slug: staffSlug,
				college: { slug: collegeSlug },
				_count: { posts: postCount }
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/staff/${staffSlug}`}>
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

export const StaffsTable: FC<{
	staffs: Staff[];
	loading?: boolean;
}> = ({ staffs, loading = false }) => {
	return <DataTable columns={columns} data={staffs} loading={loading} />;
};
