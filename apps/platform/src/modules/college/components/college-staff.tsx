'use client';

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
import { StaffsTable } from '@/modules/staff/components/staffs-table';
import { useDebouncedEffect } from '@/utils/useDebouncedEffect';
import { FC, useEffect, useState } from 'react';

const SmartTable: FC<{
	filters: { name?: string; subject?: string };
	collegeSlug: string;
	limit: number;
}> = ({ filters, collegeSlug, limit }) => {
	const [page, setPage] = useState(0);

	const query = api.staff.listByCollegeSlug.useInfiniteQuery(
		{
			collegeSlug,
			limit,
			filters
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const numOfPages = query.data?.pages[0]?.totalStaffs ?? 0;
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
			<StaffsTable
				staffs={query.data?.pages[page]?.staffs ?? []}
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

export const StaffTab: FC<{ collegeSlug: string }> = ({ collegeSlug }) => {
	const [tableProps, setTableProps] = useState<{
		filters: { name?: string; subject?: string };
	}>({
		filters: {}
	});
	const [limit, setLimit] = useState(2);
	const [search, setSearch] = useState('');

	useDebouncedEffect(
		() => {
			console.log('asd');

			setTableProps((props) => ({
				...props,
				filters: { name: search },
				limit
			}));
		},
		[search, limit],
		500
	);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-2 justify-between">
				<Input
					className="max-w-[200px]"
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<Select onValueChange={(value) => setLimit(parseInt(value))}>
					<SelectTrigger className="w-auto">
						<SelectValue placeholder={limit.toString()} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="20">20</SelectItem>
						<SelectItem value="50">50</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<SmartTable
				filters={tableProps.filters}
				collegeSlug={collegeSlug}
				limit={limit}
			/>
		</div>
	);
};
