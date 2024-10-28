'use client';

import { type FC, useEffect, useState } from 'react';

import { TFileFilters } from '../schemas/file-filters';
import { TFileScope } from '../schemas/file-scope';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { api } from '@/lib/trpc/react';
import { useDebouncedEffect } from '@/utils/useDebouncedEffect';
import { DocumentsTable } from './documents-table';

const DocumentsTableWithData: FC<{
	filters?: TFileFilters;
	scope: TFileScope;
	limit: number;
}> = ({ filters, scope, limit }) => {
	const [page, setPage] = useState(0);

	const query = api.file.listDocuments.useInfiniteQuery(
		{
			scope,
			limit,
			filters
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const numOfPages = query.data?.pages[0]?.totalPages ?? 0;
	const canGoNext = page + 1 < numOfPages;
	const canGoPrevious = page > 0;

	useEffect(() => {
		setPage(0);
	}, [filters, limit]);

	const handleNext = () => {
		if (!canGoNext) return;
		query.fetchNextPage();
		setPage((page) => page + 1);
	};

	const handlePrevious = () => {
		if (!canGoPrevious) return;
		query.fetchPreviousPage();
		setPage((page) => page - 1);
	};

	return (
		<>
			<DocumentsTable
				documents={query.data?.pages[page]?.files ?? []}
				loading={query.isFetching}
			/>

			<div className="flex flex-row gap-2 w-full justify-center items-center">
				<Button
					variant="solid-weak"
					size="sm"
					iconOnly
					onClick={handlePrevious}
					disabled={!canGoPrevious}
				>
					<Icon icon="chevron-left" />
				</Button>
				<p className="body-3">
					{page + 1} of {numOfPages}
				</p>
				<Button
					variant="solid-weak"
					size="sm"
					iconOnly
					onClick={handleNext}
					disabled={!canGoNext}
				>
					<Icon icon="chevron-right" />
				</Button>
			</div>
		</>
	);
};

export const DocumentsTableAdvanced: FC<{
	scope: TFileScope;
}> = ({ scope }) => {
	const [tableProps, setTableProps] = useState<{
		filters: TFileFilters;
		limit: number;
	}>({
		filters: {},
		limit: 5
	});

	const [viewOptions, setViewOptions] = useState<{
		filters: TFileFilters;
		limit: number;
	}>({
		filters: {
			name: ''
		},
		limit: 5
	});

	useDebouncedEffect(
		() => {
			setTableProps((props) => ({
				...props,
				...viewOptions
			}));
		},
		[viewOptions],
		500
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 justify-between">
				<Input
					className="max-w-[200px]"
					placeholder="Search"
					value={viewOptions.filters.name ?? ''}
					onChange={(e) =>
						setViewOptions({
							...viewOptions,
							filters: { name: e.target.value }
						})
					}
				/>

				<Select
					onValueChange={(value) =>
						setViewOptions({
							...viewOptions,
							limit: parseInt(value)
						})
					}
				>
					<SelectTrigger className="w-auto">
						<SelectValue
							placeholder={viewOptions.limit.toString()}
							defaultValue={viewOptions.limit.toString()}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="20">20</SelectItem>
						<SelectItem value="50">50</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<DocumentsTableWithData scope={scope} {...tableProps} />
		</div>
	);
};
