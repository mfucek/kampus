'use client';

import { useState } from 'react';

import { Icon } from '@/global/components/icon';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/lib/shadcn/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/lib/shadcn/ui/popover';
import { cn } from '@/lib/shadcn/utils';
import { useIsMobile } from '@/utils/useMediaQuery';
import { Button } from './button';
import { DialogHeader, DialogTitle } from './dialog';
import { Drawer, DrawerContent, DrawerTrigger } from './drawer';

export const Combobox = <T,>({
	values,
	value,
	onChange,
	makeKey,
	makeName,
	placeholder,
	className
}: {
	values: T[];
	value: T | null;
	onChange: (value: T | null) => void;
	makeKey: (value: T) => string;
	makeName: (value: T) => string;
	placeholder: string;
	className?: string;
}) => {
	const [open, setOpen] = useState(false);
	const { isDesktop } = useIsMobile();

	const selectedValue = value ?? null;
	const selectedName = selectedValue ? makeName(selectedValue) : null;

	const ItemList = () => {
		return (
			<Command>
				<CommandInput placeholder="Odaberi predmet..." className="h-9" />
				<CommandList>
					<CommandEmpty>No subject found.</CommandEmpty>
					<CommandGroup>
						{values.map((item) => (
							<CommandItem
								key={makeKey(item)}
								value={makeName(item)}
								onSelect={(currentValue: string) => {
									onChange(currentValue === makeKey(item) ? null : item);
									setOpen(false);
								}}
							>
								{makeName(item)}
								<Icon
									icon="checkmark"
									size={16}
									className={cn(
										'ml-auto',
										value && makeKey(item) === makeKey(value)
											? 'bg-neutral'
											: 'bg-transparent'
									)}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		);
	};

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						rounded
						aria-expanded={open}
						className={cn(className)}
					>
						{selectedName ?? placeholder}
						<Icon icon="chevron-down" className="bg-neutral-medium" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<ItemList />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className={cn(className)} rounded>
					{selectedName ?? placeholder}
					<Icon icon="chevron-down" className="bg-neutral-medium" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DialogHeader className="hidden">
					<DialogTitle>{placeholder}</DialogTitle>
				</DialogHeader>
				<div className="pb-10 pt-6">
					<ItemList />
				</div>
			</DrawerContent>
		</Drawer>
	);
};
