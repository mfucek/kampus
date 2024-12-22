'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { api } from '@/lib/trpc/react';
import { ListPermissionsItem } from '../api/procedures/list';

export const columns: ColumnDef<ListPermissionsItem>[] = [
	{
		accessorKey: 'scopeType',
		header: 'Scope Type'
	},
	{
		accessorKey: 'scopeId',
		header: 'Scope ID'
	},
	{
		accessorKey: 'rule',
		header: 'Rule'
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			const utils = api.useUtils();

			const { mutateAsync: removePermission } =
				api.account.permissions.remove.useMutation({
					onSuccess: async () => {
						await utils.account.permissions.invalidate();
					}
				});

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Button
						theme="neutral"
						variant="solid-weak"
						size="sm"
						onClick={() =>
							removePermission({
								accountId: row.original.accountId,
								rule: row.original.rule,
								scopeId: row.original.scopeId,
								scopeType: row.original.scopeType
							})
						}
					>
						<Icon icon="trash" />
						Delete
					</Button>
				</div>
			);
		}
	}
];

export const PermissionsTable: FC<{
	permissions: ListPermissionsItem[];
	loading?: boolean;
}> = ({ permissions, loading = false }) => {
	return <DataTable columns={columns} data={permissions} loading={loading} />;
};
