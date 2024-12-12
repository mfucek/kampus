'use client';

import { Button } from '@/lib/shadcn/ui/button';
import Link from 'next/link';
import {
	useState,
	type FC,
	type PropsWithChildren,
	type ReactNode
} from 'react';

const EXPAND_THRESHOLD = 5;

interface SectionListProps<T> {
	title?: string;
	info?: string;
	showAll?: boolean;
	data: T[];
	rows: (item: T) => ReactNode;
	actions?: (item: T) => ReactNode;
}

const Item: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-row gap-2 items-center justify-between bg-section md:bg-neutral-weak cursor-pointer button-md group">
			{children}
		</div>
	);
};
const ItemActions: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-row items-center gap-2 px-3 md:px-4 py-4">
			{children}
		</div>
	);
};

const ItemContent: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-row items-center gap-2 pl-3 md:pl-4 py-4">
			{children}
		</div>
	);
};

export const SectionList = <T extends { link?: string }>({
	title,
	info,
	data,
	rows,
	actions,
	showAll = false
}: SectionListProps<T>) => {
	const [expanded, setExpanded] = useState(false);

	const firstHalf = data.slice(0, EXPAND_THRESHOLD);
	const secondHalf = data.slice(EXPAND_THRESHOLD);

	const handleClick = () => {
		setExpanded((expanded) => !expanded);
	};

	const ItemList = ({ items }: { items: T[] }) =>
		items
			.slice(0, showAll || expanded ? undefined : EXPAND_THRESHOLD)
			.map((item, key) =>
				item.link ? (
					<Item key={key}>
						<Link href={item.link} className="flex-1">
							<ItemContent>{rows(item)}</ItemContent>
						</Link>
						{actions && <ItemActions>{actions(item)}</ItemActions>}
					</Item>
				) : (
					<Item key={key}>
						<ItemContent>{rows(item)}</ItemContent>
						{actions && <ItemActions>{actions(item)}</ItemActions>}
					</Item>
				)
			);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-4">
				<p className="caption text-neutral-strong">{title}</p>
				<p className="caption text-neutral-strong">{info}</p>
			</div>
			<div className="px-2 lg:px-0">
				<div className="rounded-xl overflow-x-auto overflow-y-hidden scrollbar-hidden">
					<div className="flex flex-col gap-px">
						<div className="flex flex-col gap-px">
							<ItemList items={firstHalf} />
						</div>
						<div
							className="flex flex-col gap-px"
							style={{
								display: showAll || expanded ? 'flex' : 'none'
							}}
						>
							<ItemList items={secondHalf} />
						</div>
					</div>
				</div>
			</div>
			{!showAll && data.length > EXPAND_THRESHOLD && (
				<div className="flex w-full justify-center">
					<Button onClick={handleClick} variant="outline" size="sm">
						{expanded ? 'Sakrij' : 'Prikaži sve'}
					</Button>
				</div>
			)}
		</div>
	);
};
