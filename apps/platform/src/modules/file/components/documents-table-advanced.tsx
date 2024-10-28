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
import { cn } from '@/lib/shadcn/utils';
import { api } from '@/lib/trpc/react';
import { useDebouncedEffect } from '@/utils/useDebouncedEffect';
import { DocumentFileType } from '@prisma/client';
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

const displayMap: Record<DocumentFileType, string> = {
	EXAM: 'Ispit',
	COLOQUIUM: 'Kolokvij',
	COLOQUIUM_MID: 'Meduispit',
	COLOQUIUM_FINAL: 'Zavrsni ispit',
	EXERCISE: 'Vjezba',
	HOMEWORK: 'Zadaca',
	SEMINAR: 'Seminar',
	SCRIPT: 'Skripta',
	PAPER: 'Rad',
	OTHER: 'Ostalo',
	SUMMER_EXAM: 'Ljetni rok',
	FALL_EXAM: 'Jesenski rok',
	WINTER_EXAM: 'Zimski rok',
	SPRING_EXAM: 'Proljetni rok',
	CORRECTION_EXAM: 'Ispravni ispit',
	ORAL_EXAM: 'Usmeni ispit',
	SOLVED: 'Rijesen'
};
type ExpandableDocumentFileType = (
	| DocumentFileType
	| {
			value: DocumentFileType;
			expand: DocumentFileType[];
	  }
)[];

const expandValues: ExpandableDocumentFileType = [
	{
		value: 'EXAM',
		expand: [
			'SUMMER_EXAM',
			'FALL_EXAM',
			'WINTER_EXAM',
			'SPRING_EXAM',
			'CORRECTION_EXAM',
			'ORAL_EXAM',
			'SOLVED'
		]
	},
	{
		value: 'COLOQUIUM',
		expand: ['COLOQUIUM_MID', 'COLOQUIUM_FINAL', 'SOLVED']
	},
	'EXERCISE',
	'HOMEWORK',
	'SEMINAR',
	'SCRIPT',
	'PAPER',
	'OTHER'
];

const baselineValues = expandValues.map((value) =>
	typeof value === 'string' ? value : value.value
);

const DocumentTypeSelector: FC<{
	onChange: (values: DocumentFileType[]) => void;
}> = ({ onChange }) => {
	const [selectedValues, setSelectedValues] = useState<DocumentFileType[]>([]);
	const [shownOptions, setShownOptions] = useState<DocumentFileType[]>([]);

	useEffect(() => {
		setShownOptions(() => {
			const values = expandValues
				.map((value) => {
					if (typeof value === 'string') return [value];

					let children = selectedValues.includes(value.value)
						? value.expand
						: [];
					let list = [value.value, ...children];
					return list;
				})
				.flat(1);

			const filteredUniqueValues = values.filter(
				(value, index, self) => self.indexOf(value) === index
			);

			return filteredUniqueValues;
		});
	}, [selectedValues]);

	useEffect(() => {
		onChange?.(selectedValues);
	}, [selectedValues]);

	const handleToggle = (value: DocumentFileType) => {
		if (selectedValues.includes(value)) {
			setSelectedValues((prev) => prev.filter((v) => v !== value));
		} else {
			setSelectedValues((prev) => [...prev, value]);
		}
	};

	return (
		<div>
			{shownOptions.map((option) => {
				const isBaseline = baselineValues.includes(option);
				const isSelected = selectedValues.includes(option);
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
						key={option}
						onClick={() => {
							handleToggle(option);
						}}
					>
						{displayMap[option]}
						{selectedValues.includes(option) && <Icon icon="close" />}
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
		limit: 5
	});

	const [viewOptions, setViewOptions] = useState<{
		filters: TFileFilters;
		limit: number;
	}>({
		filters: {
			name: '',
			documentTypes: []
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
