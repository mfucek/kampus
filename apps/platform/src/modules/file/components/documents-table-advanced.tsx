'use client';

import { type FC, useEffect, useState } from 'react';

import { type DocumentFileType } from '@prisma/client';

import { type TFileFilters } from '../schemas/file-filters';
import { type TFileScope } from '../schemas/file-scope';

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
import { cn } from '@/lib/shadcn/utils';
import { api } from '@/lib/trpc/react';
import { useDebouncedEffect } from '@/utils/useDebouncedEffect';
import { DocumentsTable } from './documents-table';
import { categoryLabels } from './file-details-dialog/constants/category-labels';
import { mainCategories } from './file-details-dialog/constants/document-categories';
import { removeCategoryFromSelectedCategories } from './file-details-dialog/constants/removeCategoryFromSelectedCategories';
import { shownCategoriesBasedOnSelectedCategories } from './file-details-dialog/constants/shownCategoriesBasedOnSelectedCategories';

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

	const handleNext = async () => {
		if (!canGoNext) return;
		await query.fetchNextPage();
		setPage((page) => page + 1);
	};

	const handlePrevious = async () => {
		if (!canGoPrevious) return;
		await query.fetchPreviousPage();
		setPage((page) => page - 1);
	};

	return (
		<>
			<DocumentsTable
				documents={query.data?.pages[page]?.files ?? []}
				loading={query.isFetching}
				highlightedCategories={filters?.documentTypes ?? []}
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

const DocumentTypeSelector: FC<{
	onChange: (values: DocumentFileType[]) => void;
}> = ({ onChange }) => {
	const [selectedValues, setSelectedValues] = useState<DocumentFileType[]>([]);

	useEffect(() => {
		onChange?.(selectedValues);
	}, [selectedValues]);

	const handleToggle = (value: DocumentFileType) => {
		if (selectedValues.includes(value)) {
			setSelectedValues((prev) =>
				removeCategoryFromSelectedCategories(prev, value)
			);
		} else {
			setSelectedValues((prev) => [...prev, value]);
		}
	};

	return (
		<div>
			{shownCategoriesBasedOnSelectedCategories(selectedValues).map((type) => {
				const isBaseline = mainCategories.includes(type);
				const isSelected = selectedValues.includes(type);
				return (
					<Button
						variant={isSelected ? 'solid' : 'outline'}
						theme={isBaseline || isSelected ? 'accent' : 'neutral'}
						size="sm"
						className={cn(
							'mr-2 mb-2',
							!isBaseline && 'animate-push-fade-right'
						)}
						rounded
						key={type}
						onClick={() => {
							handleToggle(type);
						}}
					>
						{categoryLabels[type]}
						{selectedValues.includes(type) && <Icon icon="close" />}
					</Button>
				);
			})}
		</div>
	);
};

export const DocumentsTableAdvanced: FC<{
	scope: TFileScope;
}> = ({ scope }) => {
	const [tableProps, setTableProps] = useState<{
		filters: TFileFilters;
		limit: number;
	}>({
		filters: {
			documentTypes: []
		},
		limit: 10
	});

	const [viewOptions, setViewOptions] = useState<{
		filters: TFileFilters;
		limit: number;
	}>({
		filters: {
			name: '',
			documentTypes: []
		},
		limit: 10
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
			<DocumentTypeSelector
				onChange={(documentTypes) => {
					setViewOptions({
						...viewOptions,
						filters: { ...viewOptions.filters, documentTypes }
					});
				}}
			/>

			<DocumentsTableWithData scope={scope} {...tableProps} />
		</div>
	);
};
