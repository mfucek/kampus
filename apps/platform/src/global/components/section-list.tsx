'use client';

import Link from 'next/link';
import { type FC, type PropsWithChildren, type ReactNode } from 'react';

interface SectionListProps<T> {
	title?: string;
	info?: string;
	expandable?: boolean;
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
		<div className="flex flex-row gap-2 px-3 md:px-4 py-4">{children}</div>
	);
};

export const SectionList = <T extends { link?: string }>({
	title,
	info,
	data,
	rows,
	actions
}: SectionListProps<T>) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-4">
				<p className="caption text-neutral-strong">{title}</p>
				<p className="caption text-neutral-strong">{info}</p>
			</div>
			<div className="px-2 lg:px-0">
				<div className="flex flex-col gap-px rounded-xl overflow-hidden">
					{data.map((item, key) =>
						item.link ? (
							<Item key={key}>
								<Link href={item.link} className="flex-1">
									<div className="pl-3 md:pl-4 py-4">{rows(item)}</div>
								</Link>
								{actions && <ItemActions>{actions(item)}</ItemActions>}
							</Item>
						) : (
							<Item key={key}>
								<div className="pl-3 md:lr-4 flex-1">{rows(item)}</div>
								{actions && <ItemActions>{actions(item)}</ItemActions>}
							</Item>
						)
					)}
				</div>
			</div>
		</div>
	);
};
