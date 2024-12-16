'use client';

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
import { categoryLabels } from '@/modules/file/components/file-details-dialog/categoryLabels';
import { removeCategoryFromSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/removeCategoryFromSelectedCategories';
import { shownCategoriesBasedOnSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/shownCategoriesBasedOnSelectedCategories';
import { useFileStagingContext } from '@/modules/file/contexts/file-staging-provider';
import { UploadArea } from '@/modules/file/hooks/use-upload-area';

export const FileListSection = () => {
	const { files, removeFile, openFileDetailsDialog, updateFile, addFiles } =
		useFileStagingContext();

	const handleAddFiles = (files: File[]) => {
		addFiles(files, {
			openFileDetailsDialog: false
		});
	};

	return (
		<SectionList
			data={files}
			wrapper={({ children }) => (
				<UploadArea addFiles={handleAddFiles}>{children}</UploadArea>
			)}
			rows={(file, index) => (
				<>
					<div className="body-2 w-[200px] break-all">{file.name}</div>

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
								<Icon icon="status-warning" size={20} className="bg-warning" />
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
			emptyRow={
				<div className="body-2 text-center w-full text-neutral-strong">
					Popis je prazan, dodaj materijale.
				</div>
			}
			title="Dokumenti"
			info={`${files.length} dokumenata`}
			showAll
		/>
	);
};
