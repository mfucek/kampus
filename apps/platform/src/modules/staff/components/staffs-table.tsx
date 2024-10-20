'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Staff = {
	topic: {
		slug: string;
		college: {
			slug: string;
		};
	};
};

export const columns: ColumnDef<Staff>[] = [
	{
		accessorKey: 'topic.name',
		header: 'Ime'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const {
				topic: {
					slug: staffSlug,
					college: { slug: collegeSlug }
				}
			} = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Link href={`/${collegeSlug}/staff/${staffSlug}`}>
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="chat-single" />2 topics
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
