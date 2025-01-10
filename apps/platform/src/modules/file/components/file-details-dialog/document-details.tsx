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
import { type DocumentFileType } from '@prisma/client';
import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { useFileStagingContext } from '../../../file/contexts/file-staging-provider';
import { categoryLabels } from './constants/category-labels';
import { mainCategories, subCategories } from './constants/document-categories';
import { removeCategoryFromSelectedCategories } from './constants/removeCategoryFromSelectedCategories';

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

export const DocumentDetails = () => {
	const { files, fileDetailsIndex, updateFile } = useFileStagingContext();

	const file = files[fileDetailsIndex!]!;

	const [academicYear, setAcademicYear] = useState<string | null>(
		file.documentOptions.academicYear
	);
	const [selectedCategories, setSelectedCategories] = useState<
		DocumentFileType[]
	>(file.documentOptions.types);
	const [name, setName] = useState<string | null>(file.name);

	const handleCategoryClick = (documentType: DocumentFileType) => {
		const alreadySelected = selectedCategories.includes(documentType);

		if (alreadySelected) {
			setSelectedCategories((prev) =>
				removeCategoryFromSelectedCategories(prev, documentType)
			);
		} else {
			setSelectedCategories((prev) => [...new Set([...prev, documentType])]);
		}
	};

	const handleSelectCategory = (documentType: DocumentFileType) => {
		setSelectedCategories((prev) => [...new Set([...prev, documentType])]);
	};

	const handleDeselectCategory = (documentType: DocumentFileType) => {
		setSelectedCategories((prev) =>
			prev.filter((category) => category !== documentType)
		);
	};

	useEffect(() => {
		updateFile(fileDetailsIndex!, {
			name: name ?? '',
			documentOptions: {
				academicYear: academicYear ?? null,
				types: selectedCategories
			}
		});
	}, [name, selectedCategories, academicYear]);

	const showExamCategories = selectedCategories.includes('EXAM');
	const showColoquiumCategories = selectedCategories.includes('COLOQUIUM');
	const showSolvedCategory =
		selectedCategories.includes('EXAM') ||
		selectedCategories.includes('COLOQUIUM');

	return (
		<form className="flex flex-col md:gap-0 gap-10 w-full h-full">
			<div className="px-3 md:p-6 flex flex-col gap-3 md:border-b border-b-neutral-weak">
				<p className="title-3">Detalji</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
					<div className="flex flex-col gap-2">
						<p className="caption">Naziv dokumenta</p>
						<Input
							placeholder="Naziv dokumenta"
							value={name ?? ''}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="caption">Akademska godina</p>
						<Select
							defaultValue={academicYear ?? undefined}
							onValueChange={(value) => setAcademicYear(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Izaberi akademsku godinu" />
							</SelectTrigger>
							<SelectContent>
								{/* @ts-expect-error TODO */}
								<SelectItem value={null}>-</SelectItem>
								{new Array(50).fill(0).map((_, i) => {
									const currentlyInFirstHalfOfCurrentYear =
										new Date().getMonth() < 6;
									const currentYear = currentlyInFirstHalfOfCurrentYear
										? new Date().getFullYear() - 1
										: new Date().getFullYear();
									const year = currentYear - i;
									return (
										<SelectItem key={i} value={`${year}/${year + 1}`}>
											{`${year} / ${year + 1}`}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="px-3 md:p-6 flex flex-col gap-3">
				<div className="flex flex-col gap-6">
					<Section title="Kategorija" description="O kakvom dokumentu se radi?">
						<div className="w-full -mr-2 -mb-2">
							{mainCategories.map((value, i) => (
								<div className="mr-2 mb-2 inline-block" key={i}>
									<Button
										variant={
											selectedCategories.includes(value) ? 'solid' : 'outline'
										}
										theme={
											selectedCategories.includes(value) ? 'accent' : 'neutral'
										}
										size="sm"
										type="button"
										rounded
										onClick={() => {
											handleCategoryClick(value);
										}}
									>
										{categoryLabels[value]}
									</Button>
								</div>
							))}
						</div>
					</Section>

					{showExamCategories && (
						<Section
							title="Kategorija ispita"
							description="O kojem tipu ispita se radi?"
						>
							<div className="w-full -mr-2 -mb-2">
								{subCategories.EXAM.map((value, i) => (
									<div className="mr-2 mb-2 inline-block" key={i}>
										<Button
											variant={
												selectedCategories.includes(value) ? 'solid' : 'outline'
											}
											theme={
												selectedCategories.includes(value)
													? 'accent'
													: 'neutral'
											}
											size="sm"
											type="button"
											rounded
											onClick={() => {
												handleCategoryClick(value);
											}}
										>
											{categoryLabels[value]}
										</Button>
									</div>
								))}
							</div>
						</Section>
					)}

					{showColoquiumCategories && (
						<Section
							title="Kategorija kolokvija"
							description="O kakvom tipu kolokvija se radi?"
						>
							<div className="w-full -mr-2 -mb-2">
								{subCategories.COLOQUIUM.map((value, i) => (
									<div className="mr-2 mb-2 inline-block" key={i}>
										<Button
											variant={
												selectedCategories.includes(value) ? 'solid' : 'outline'
											}
											theme={
												selectedCategories.includes(value)
													? 'accent'
													: 'neutral'
											}
											size="sm"
											type="button"
											rounded
											onClick={() => {
												handleCategoryClick(value);
											}}
										>
											{categoryLabels[value]}
										</Button>
									</div>
								))}
							</div>
						</Section>
					)}

					{showSolvedCategory && (
						<Section
							title="Rješenost"
							description="Jesu li priloženi postupci ili rješenja?"
						>
							<div className="w-full -mr-2 -mb-2">
								<div className="mr-2 mb-2 inline-block">
									<Button
										variant={
											selectedCategories.includes('SOLVED')
												? 'solid'
												: 'outline'
										}
										theme={
											selectedCategories.includes('SOLVED')
												? 'accent'
												: 'neutral'
										}
										size="sm"
										type="button"
										rounded
										onClick={() => {
											handleSelectCategory('SOLVED');
										}}
									>
										Da
									</Button>
								</div>
								<div className="mr-2 mb-2 inline-block">
									<Button
										variant={
											!selectedCategories.includes('SOLVED')
												? 'solid'
												: 'outline'
										}
										theme={
											!selectedCategories.includes('SOLVED')
												? 'accent'
												: 'neutral'
										}
										size="sm"
										type="button"
										rounded
										onClick={() => {
											handleDeselectCategory('SOLVED');
										}}
									>
										Ne
									</Button>
								</div>
							</div>
						</Section>
					)}
				</div>
			</div>
		</form>
	);
};
