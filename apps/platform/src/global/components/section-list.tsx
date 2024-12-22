'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import Link from 'next/link';
import React, {
	useState,
	type FC,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactNode
} from 'react';
import { ContentPadding } from '../layouts/content-padding';

const EXPAND_THRESHOLD = 5;

interface SectionListProps<T> {
	title?: string;
	info?: ReactNode;
	showAll?: boolean;
	data: T[];
	keyKey?: keyof T;
	rows: (item: T, index: number) => ReactNode;
	actions?: (item: T, index: number) => ReactNode;
	emptyRow?: ReactNode;
	wrapper?: (props: { children: ReactNode }) => ReactNode;
}

const Item: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
	return (
		<div
			className={cn(
				'flex flex-row gap-2 items-center justify-between bg-section md:bg-neutral-weak button-md group',
				className
			)}
			{...props}
		/>
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

const ItemEmptyContent: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				'flex flex-row w-full items-center gap-2 px-3 md:px-4 py-4',
				className
			)}
			{...props}
		/>
	);
};

export const SectionList = <T extends Record<string, unknown>>({
	title,
	info,
	data,
	rows,
	actions,
	emptyRow,
	showAll = false,
	wrapper
}: SectionListProps<T>) => {
	const [expanded, setExpanded] = useState(false);

	const firstHalf = data.slice(0, EXPAND_THRESHOLD);
	const secondHalf = data.slice(EXPAND_THRESHOLD);

	const handleClick = () => {
		setExpanded((expanded) => !expanded);
	};

	const Wrapper = wrapper ?? React.Fragment;

	const ItemList = ({ items }: { items: T[] }) =>
		items
			.slice(0, showAll || expanded ? undefined : EXPAND_THRESHOLD)
			.map((item, index) => {
				const key = index; // keyKey ? (item[keyKey] as string) : index;

				return (
					<React.Fragment key={key}>
						{item.link ? (
							<Item className="cursor-pointer">
								<Link href={item.link} className="flex-1">
									<ItemContent>{rows(item, index)}</ItemContent>
								</Link>
								{actions && <ItemActions>{actions(item, index)}</ItemActions>}
							</Item>
						) : (
							<Item>
								<ItemContent>{rows(item, index)}</ItemContent>
								{actions && <ItemActions>{actions(item, index)}</ItemActions>}
							</Item>
						)}
					</React.Fragment>
				);
			});

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-4">
				<p className="caption text-neutral-strong">{title}</p>
				<p className="caption text-neutral-strong">{info}</p>
			</div>
			<Wrapper>
				<ContentPadding size="sm">
					<div className="rounded-xl overflow-x-auto overflow-y-hidden scrollbar-hidden">
						<div className="flex flex-col gap-px">
							{data.length === 0 && (
								<Item>
									<ItemEmptyContent>{emptyRow}</ItemEmptyContent>
								</Item>
							)}
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
				</ContentPadding>
			</Wrapper>
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
