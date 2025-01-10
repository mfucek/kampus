'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type FC } from 'react';

import { type ListDocumentsItem } from '../api/procedures/list-documents';

import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import { DataTable } from '@/lib/shadcn/ui/data-table';
import { usePostId } from '@/modules/discussion-panel/components/post-id-provider';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/constants/category-labels';
import { type DocumentFileType } from '@prisma/client';

export const columns: ColumnDef<
	ListDocumentsItem & { highlightedCategories: DocumentFileType[] }
>[] = [
	{
		accessorKey: 'document.title',
		header: 'Ime'
	},
	{
		accessorKey: 'document.academicYear',
		header: 'Akademska godina'
	},
	{
		accessorKey: 'document.types',
		header: 'Tipovi',
		cell: ({ row }) => (
			<div className="flex flex-row flex-wrap gap-2">
				{row.original.document.types.map((type) => {
					const isInSearch = row.original.highlightedCategories.includes(type);
					return (
						<Badge
							key={type}
							variant={isInSearch ? 'secondary' : 'tertiary'}
							theme="neutral"
						>
							{categoryLabels[type]}
						</Badge>
					);
				})}
			</div>
		)
	},
	{
		id: 'actions-open',
		cell: ({ row }) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { setPostId } = usePostId();

			const data = row.original;

			return (
				<div className="flex flex-row gap-1 justify-end">
					<Button
						theme="neutral"
						variant="solid-weak"
						size="sm"
						onClick={() => {
							if (data.post.id) setPostId(data.post.id);
						}}
					>
						<Icon icon="chat-single" />
						Open discussion
					</Button>
					<a href={data.url} target="_blank" rel="noreferrer">
						<Button theme="neutral" variant="solid-weak" size="sm">
							<Icon icon="download" />
							Download
						</Button>
					</a>
				</div>
			);
		}
	}
];

export const DocumentsTable: FC<{
	documents: ListDocumentsItem[];
	loading?: boolean;
	highlightedCategories?: DocumentFileType[];
}> = ({ documents, loading = false, highlightedCategories = [] }) => {
	return (
		<DataTable
			columns={columns}
			data={documents.map((c) => ({ ...c, highlightedCategories }))}
			loading={loading}
		/>
	);
};
