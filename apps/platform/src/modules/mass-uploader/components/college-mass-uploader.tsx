'use client';

import { FC, PropsWithChildren } from 'react';

import { Icon } from '@/global/components/icon';
import { SectionList } from '@/global/components/section-list';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/lib/shadcn/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { api } from '@/lib/trpc/react';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/categoryLabels';
import { removeCategoryFromSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/removeCategoryFromSelectedCategories';
import { shownCategoriesBasedOnSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/shownCategoriesBasedOnSelectedCategories';
import {
	FileStagingProvider,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';
import { useUploadDialog } from '@/modules/file/hooks/use-upload-dialog';

const Section: FC<
	PropsWithChildren & {
		title: string;
		description?: string;
		id?: string;
	}
> = ({ children, title, description, id }) => {
	return (
		<div className="flex flex-col @sm:flex-row gap-10" id={id}>
			<div className="flex flex-col gap-2 @sm:w-[400px]">
				<p className="title-3 text-neutral">{title}</p>
				<p className="body-2 text-neutral-strong">{description}</p>
			</div>
			<div className="flex flex-col gap-10 flex-1">{children}</div>
		</div>
	);
};

const Divider = () => {
	return <div className="w-full h-[1px] bg-neutral-weak" />;
};

export const CollegeMassUploader = ({ collegeId }: { collegeId: string }) => {
	return (
		<FileStagingProvider>
			<MassUploader collegeId={collegeId} />
		</FileStagingProvider>
	);
};

export const MassUploader = ({ collegeId }: { collegeId: string }) => {
	const { files, addFiles, removeFile, openFileDetailsDialog, updateFile } =
		useFileStagingContext();
	const { openUploadDialog: openFileDialog } = useUploadDialog(addFiles);

	const { data: subjects } = api.subject.list.useQuery({
		scope: {
			collegeId: collegeId
		}
	});

	const subjectsSorted = (subjects?.subjects ?? []).sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<div className="flex flex-col gap-10">
			<Section
				title="1. Pripremi materijale"
				description="Iz proizvoljnog izvora pronadi sve materijale koje smatras korisnima: skripte, ispite, popise zadataka, itd."
			/>

			<Divider />
			<Section
				title="2. Odaberi predmet"
				description="U izborniku desno odaberi predmet"
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select a subject" />
						</SelectTrigger>
						<SelectContent>
							{subjectsSorted.sort().map((s) => (
								<SelectItem key={s.id} value={s.id}>
									{s.name}{' '}
									<span className="text-neutral-strong">
										({s.externalCode})
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</Section>

			<Divider />

			<Section
				title="3. Prenesi materijale"
				description={`Dovuci dokumente u popis dolje, dodaj kategoriju na svaki dokument i, ako ima smisla, dodaj akademsku godinu (npr. za ispite). Ako nedostaje neka kategorija javi mi se, pa ju dodamo!`}
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Button
						size="md"
						variant="solid-weak"
						rounded
						onClick={openFileDialog}
					>
						Dodaj materijale
					</Button>
					<Button size="md" variant="solid" rounded>
						Prenesi sve
					</Button>
				</div>
			</Section>

			<SectionList
				data={files}
				rows={(file, index) => (
					<>
						<div className="body-2 w-[200px]">{file.name}</div>

						<Select
							// size="xs" variant="outline" rounded
							value={file.documentOptions?.academicYear ?? undefined}
							onValueChange={(value) =>
								file.documentOptions &&
								updateFile(index, {
									documentOptions: {
										...file.documentOptions,
										academicYear: value
									}
								})
							}
						>
							<SelectTrigger className="w-auto" size="xs">
								<SelectValue placeholder="Godina" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="2024/2025">2024 / 2025</SelectItem>
								<SelectItem value="2023/2024">2023 / 2024</SelectItem>
								<SelectItem value="2022/2023">2022 / 2023</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex flex-row gap-1">
							<Popover>
								{file.documentOptions?.types.map((type) => (
									<PopoverTrigger asChild key={type}>
										<Button size="xs" variant="outline" rounded>
											{categoryLabels[type]}
										</Button>
									</PopoverTrigger>
								))}
								<PopoverTrigger asChild>
									<Button size="xs" variant="outline" iconOnly rounded>
										<Icon icon="add" />
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<div className="flex flex-row flex-wrap gap-2">
										{shownCategoriesBasedOnSelectedCategories(
											file.documentOptions?.types ?? []
										).map((type) => {
											const isSelected =
												file.documentOptions?.types.includes(type);
											return (
												<Button
													size="xs"
													variant={isSelected ? 'solid' : 'outline'}
													theme={isSelected ? 'accent' : 'neutral'}
													rounded
													key={type}
													onClick={() => {
														if (!file.documentOptions) {
															return;
														}
														if (isSelected) {
															updateFile(index, {
																documentOptions: {
																	...file.documentOptions,
																	types: removeCategoryFromSelectedCategories(
																		file.documentOptions?.types ?? [],
																		type
																	)
																}
															});
														} else {
															updateFile(index, {
																documentOptions: {
																	...file.documentOptions,
																	types: [
																		...(file.documentOptions?.types ?? []),
																		type
																	]
																}
															});
														}
													}}
												>
													{categoryLabels[type]}
												</Button>
											);
										})}
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</>
				)}
				actions={(file, index) => (
					<>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Icon
										icon="status-warning"
										size={20}
										className="bg-warning"
									/>
								</TooltipTrigger>
								<TooltipContent>
									<p>Dokument nije validan</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button
							size="sm"
							variant={'ghost-weak'}
							iconOnly
							onClick={() => openFileDetailsDialog(index)}
						>
							<Icon icon="edit" />
						</Button>
						<Button
							size="sm"
							variant={'ghost-weak'}
							iconOnly
							onClick={() => removeFile(index)}
						>
							<Icon icon="trash" />
						</Button>
					</>
				)}
				title="Dokumenti"
				info={`${files.length} dokumenata`}
				showAll
			/>
		</div>
	);
};
