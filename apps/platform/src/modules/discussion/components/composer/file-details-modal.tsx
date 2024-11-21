'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	DialogBody,
	DialogClose,
	DialogContent,
	DialogFooter
} from '@/lib/shadcn/ui/dialog';
import { Input } from '@/lib/shadcn/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { cn } from '@/lib/shadcn/utils';
import { FC, PropsWithChildren, useState } from 'react';

const Section: FC<
	{
		title: string;
		description: string;
	} & PropsWithChildren
> = ({ children, title, description }) => {
	return (
		<div className="flex flex-col md:flex-row gap-4 md:gap-2">
			<div className="w-[200px] flex flex-col gap-1">
				<p className="caption">{title}</p>
				<p className="body-3 text-neutral-strong">{description}</p>
			</div>
			{children}
		</div>
	);
};

const categories = {
	EXAM: 'Ispit',
	COLOQUIUM: 'Kolokvij',
	EXERCISE: 'Vjezba',
	HOMEWORK: 'Zadaca',
	SEMINAR: 'Seminar',
	SCRIPT: 'Skripta / Biljeske',
	PAPER: 'Rad',
	OTHER: 'Ostalo'
};

const coloquiumCategories = {
	COLOQUIUM_MID: 'Međuispit',
	COLOQUIUM_FINAL: 'Završni ispit',
	SOLVED: 'Riješeni zadaci'
};

const examCategories = {
	SUMMER_EXAM: 'Ljetni ispit',
	FALL_EXAM: 'Jesenski ispit',
	WINTER_EXAM: 'Zimski ispit',
	SPRING_EXAM: 'Proljetni ispit',
	CORRECTION_EXAM: 'Popravni ispit',
	ORAL_EXAM: 'Usmeni ispit'
};

const SidebarFile: FC<{
	selected?: boolean;
	onClick: () => void;
}> = ({ selected = false, onClick }) => {
	return (
		<div
			className={cn(
				'px-2 py-3 rounded-lg flex flex-row gap-2 items-center clickable',
				selected && 'bg-neutral-weak'
			)}
			onClick={onClick}
		>
			<Icon icon="file" className="bg-neutral-strong" size={16} />
			<div className="flex flex-col flex-1">
				<p
					className={cn(
						'body-3 truncate',
						selected ? 'text-neutral' : 'text-neutral-strong'
					)}
				>
					File.pdf
				</p>
				<p
					className={cn(
						'body-3',
						selected ? 'text-neutral' : 'text-neutral-strong'
					)}
				>
					123kB
				</p>
			</div>
			<Button variant="ghost-weak" size="xs" iconOnly>
				<Icon icon="trash" size={16} />
			</Button>
		</div>
	);
};

export const FileDetailsModal = () => {
	const [selectedFile, setSelectedFile] = useState<number | null>(0);

	return (
		<DialogContent>
			{/* <DialogHeader>
				<DialogTitle>Upload Files</DialogTitle>
				<DialogDescription>
					A  modal component for shadcn/ui.
				</DialogDescription>
			</DialogHeader> */}

			{/* <DialogBody className="md:max-h-[640px] flex flex-col md:flex-row"> */}
			<DialogBody className="w-full h-full md:flex md:flex-row overflow-y-scroll md:overflow-hidden">
				<div className="flex flex-col flex-1 md:border-r border-r-neutral-weak">
					<div className="px-4 py-6 md:border-b border-neutral-weak title-3 shrink-0">
						Materijali
					</div>

					<div className="flex flex-row md:flex-col flex-1 px-2 py-6 min-w-[200px] overflow-y-auto">
						{Array.from({ length: 10 }, (_, index) => (
							<SidebarFile
								selected={selectedFile === index}
								onClick={() => setSelectedFile(index)}
								key={index}
							/>
						))}
					</div>
				</div>

				<form className="flex flex-col w-full h-full md:overflow-y-auto">
					<div className="p-6 flex flex-col gap-3 md:border-b border-b-neutral-weak">
						<p className="title-3">Detalji</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
							<div className="flex flex-col gap-2">
								<p className="caption">Naziv dokumenta</p>
								<Input placeholder="Naziv dokumenta" />
							</div>
							<div className="flex flex-col gap-2">
								<p className="caption">Akademska godina</p>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Izaberi akademsku godinu" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={'-'}>-</SelectItem>
										{Array.from({ length: 20 }, (_, index) => (
											<SelectItem
												key={`${new Date().getFullYear() - index}/${
													new Date().getFullYear() - index + 1
												}`}
												value={`${new Date().getFullYear() - index}/${
													new Date().getFullYear() - index + 1
												}`}
											>
												{`${new Date().getFullYear() - index}/${
													new Date().getFullYear() - index + 1
												}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="p-6 flex flex-col gap-3">
						<p className="title-3">Kategorije</p>
						<div className="flex flex-col gap-6">
							<Section
								title="Kategorija"
								description="O kakvom dokumentu se radi?"
							>
								<div className="grid grid-cols-2 gap-2 w-full">
									{Object.entries(categories).map(([key, value]) => (
										<div
											className="flex flex-row gap-2 items-center w-full"
											key={key}
										>
											<input type="radio" id={key} name="category" />
											<label htmlFor="category" className="body-3">
												{value}
											</label>
										</div>
									))}
								</div>
							</Section>

							<Section
								title="Kategorija ispita"
								description="O kojem tipu ispita se radi?"
							>
								<div className="grid grid-cols-2 gap-2 w-full">
									{Object.entries(examCategories).map(([key, value]) => (
										<div
											className="flex flex-row gap-2 items-center w-full"
											key={key}
										>
											<input type="radio" id={key} name="examCategory" />
											<label htmlFor="examCategory" className="body-3">
												{value}
											</label>
										</div>
									))}
								</div>
							</Section>

							<Section
								title="Kategorija kolokvija"
								description="O kakvom tipu kolokvija se radi?"
							>
								<div className="grid grid-cols-2 gap-2 w-full">
									{Object.entries(coloquiumCategories).map(([key, value]) => (
										<div
											className="flex flex-row gap-2 items-center w-full"
											key={key}
										>
											<input type="radio" id={key} name="coloquiumCategory" />
											<label htmlFor="coloquiumCategory" className="body-3">
												{value}
											</label>
										</div>
									))}
								</div>
							</Section>

							<Section
								title="Rješenost"
								description="Jesu li priloženi postupci ili rješenja?"
							>
								<div className="grid grid-cols-2 gap-2 w-full">
									<div className="flex flex-row gap-2 items-center w-full">
										<input type="radio" name="solved" />
										<label htmlFor="solved" className="body-3">
											Da
										</label>
									</div>
									<div className="flex flex-row gap-2 items-center w-full">
										<input type="radio" name="notSolved" />
										<label htmlFor="notSolved" className="body-3">
											Ne
										</label>
									</div>
								</div>
							</Section>
						</div>
					</div>
				</form>
			</DialogBody>

			<DialogFooter className="border-t border-neutral-weak p-3">
				<Button variant="solid-weak">
					Dodaj file
					<Icon icon="upload" size={16} />
				</Button>
				<div className="flex flex-col md:flex-row gap-2 flex-1 justify-end">
					{/* <DialogClose asChild>
						<Button variant="solid-weak">Odustani</Button>
					</DialogClose> */}
					<DialogClose asChild>
						<Button theme="accent">Spremi</Button>
					</DialogClose>
				</div>
			</DialogFooter>
		</DialogContent>
	);
};
