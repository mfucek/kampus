'use client';

import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/deps/trpc/react';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from '@/lib/shadcn/ui/command';
import { useEffect, useState } from 'react';
import { Icon } from '../../../global/components/icon';

export const SearchBar = () => {
	const [open, setOpen] = useState(false);

	const collegesQuery = api.topic.college.listAll.useQuery();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<>
			<div
				className="hidden md:flex flex-row gap-2 px-4 items-center absolute w-2/5 max-w-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-neutral-medium rounded-full h-[40px] duration-300 hover:md:border-neutral-strong cursor-text"
				onClick={() => setOpen(true)}
			>
				<Icon icon="search" className="bg-neutral-medium" size={16} />
				<p className="input text-neutral-medium w-full">Traži...</p>
				<kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded-md border border-neutral-medium px-1 caption text-neutral-strong opacity-100 select-none">
					⌘K
				</kbd>
			</div>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>Pretraga nije pronašla rezultate.</CommandEmpty>
					<CommandGroup heading="Fakulteti">
						{collegesQuery.data?.colleges.map((college) => (
							<CommandItem asChild key={college.topic.id}>
								<Link
									href={college.link}
									key={college.topic.id}
									onClick={() => setOpen(false)}
								>
									<div className="w-5 h-5 rounded-md bg-neutral-medium relative overflow-hidden">
										{college.topic.imageUrl && (
											<Image
												src={college.topic.imageUrl}
												alt="College Image"
												fill
											/>
										)}
									</div>
									<span>{college.topic.name}</span>
								</Link>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Kampus">
						<CommandItem asChild>
							<Link href="/settings/profile" onClick={() => setOpen(false)}>
								<Icon icon="user" size={20} />
								<span>Profil</span>
							</Link>
						</CommandItem>
						<CommandItem asChild>
							<Link href="/settings/appearance" onClick={() => setOpen(false)}>
								<Icon icon="moon" size={20} />
								<span>Izgled</span>
							</Link>
						</CommandItem>
						<CommandItem asChild>
							<Link href="/settings/profile" onClick={() => setOpen(false)}>
								<Icon icon="settings" size={20} />
								<span>Postavke</span>
							</Link>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};
