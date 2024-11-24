'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { FC, PropsWithChildren } from 'react';

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

export const DocumentDetails = () => {
	return (
		<form className="flex flex-col md:gap-0 gap-10 w-full h-full">
			<div className="px-3 md:p-6 flex flex-col gap-3 md:border-b border-b-neutral-weak">
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

			<div className="px-3 md:p-6 flex flex-col gap-3">
				<div className="flex flex-col gap-6">
					<Section title="Kategorija" description="O kakvom dokumentu se radi?">
						<div className="w-full -mr-2 -mb-2">
							{Object.entries(categories).map(([key, value]) => (
								<div className="mr-2 mb-2 inline-block" key={key}>
									<Button variant="outline" size="sm" type="button" rounded>
										{value}
									</Button>
								</div>
							))}
						</div>
					</Section>

					<Section
						title="Kategorija ispita"
						description="O kojem tipu ispita se radi?"
					>
						<div className="w-full -mr-2 -mb-2">
							{Object.entries(examCategories).map(([key, value]) => (
								<div className="mr-2 mb-2 inline-block" key={key}>
									<Button variant="outline" size="sm" type="button" rounded>
										{value}
									</Button>
								</div>
							))}
						</div>
					</Section>

					<Section
						title="Kategorija kolokvija"
						description="O kakvom tipu kolokvija se radi?"
					>
						<div className="w-full -mr-2 -mb-2">
							{Object.entries(coloquiumCategories).map(([key, value]) => (
								<div className="mr-2 mb-2 inline-block" key={key}>
									<Button variant="outline" size="sm" type="button" rounded>
										{value}
									</Button>
								</div>
							))}
						</div>
					</Section>

					<Section
						title="Rješenost"
						description="Jesu li priloženi postupci ili rješenja?"
					>
						<div className="w-full -mr-2 -mb-2">
							<div className="mr-2 mb-2 inline-block">
								<Button variant="outline" size="sm" type="button" rounded>
									Da
								</Button>
							</div>
							<div className="mr-2 mb-2 inline-block">
								<Button variant="outline" size="sm" type="button" rounded>
									Ne
								</Button>
							</div>
						</div>
					</Section>
				</div>
			</div>
		</form>
	);
};
