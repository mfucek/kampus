'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Staff = {
	slug: string;
	college: {
		slug: string;
	};
	_count: {
		Post: number;
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
				_count: { Post: postCount }
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

export const StaffsTable = ({ staffs }: { staffs: Staff[] }) => {
	return <DataTable columns={columns} data={staffs} loading={false} />;
};
