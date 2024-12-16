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
import { api } from '@/lib/trpc/react';
import { useComposerController } from '@/modules/composer/contexts/composer-controller-provider';
import { usePostId } from '@/modules/discussion-panel/components/post-id-provider';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/categoryLabels';
import { removeCategoryFromSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/removeCategoryFromSelectedCategories';
import { shownCategoriesBasedOnSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/shownCategoriesBasedOnSelectedCategories';
import {
	type StagedFile,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';
import { UploadArea } from '@/modules/file/hooks/use-upload-area';
import { DocumentFileType } from '@prisma/client';
import { formatDistance } from 'date-fns';
import { useState } from 'react';

const FileRow = (file: StagedFile, index: number) => {
	const { updateFile } = useFileStagingContext();

	return (
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
								const isSelected = file.documentOptions?.types.includes(type);
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
	);
};

const noOverlap = <T,>(a: T[], b: T[]) => {
	return a.every((item) => !b.includes(item));
};

const ignoredTypes: DocumentFileType[] = [
	'OTHER',
	'EXERCISES',
	'HOMEWORK',
	'SCRIPT',
	'NOTES'
];

const FileActions = (file: StagedFile, index: number) => {
	const { removeFile, openFileDetailsDialog } = useFileStagingContext();
	const { topicId } = useComposerController();

	const { setPostId } = usePostId();

	const [duplicates, setDuplicates] = useState<string[] | null>(null);

	const { data: duplicatesData } = api.subject.hasFileOfKind.useQuery(
		{
			types: file.documentOptions?.types ?? [],
			year: file.documentOptions?.academicYear!,
			subjectId: topicId!
		},
		{
			enabled:
				!!topicId &&
				!!file.documentOptions?.academicYear &&
				noOverlap<DocumentFileType>(file.documentOptions.types, ignoredTypes)
		}
	);

	return (
		<>
			{duplicatesData?.length && (
				<Popover>
					<Popover>
						<PopoverTrigger asChild>
							<Button size="sm" variant={'ghost'} theme="warning" iconOnly>
								<Icon icon="status-warning" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="flex flex-col gap-2">
							<p className="body-2 text-neutral-strong">
								Iste kategorije postoje na drugim dokumentima:
							</p>
							<div className="flex flex-col">
								{duplicatesData.map((duplicate, i) => (
									<Button
										key={i}
										className="body-3 justify-start w-full"
										variant="ghost"
										onClick={() => {
											setPostId(duplicate.id);
										}}
									>
										<div className="w-full text-left">{duplicate.author}</div>
										<div className="caption text-neutral-strong">
											{formatDistance(
												new Date(duplicate.createdAt),
												new Date(),
												{
													addSuffix: true,
													includeSeconds: true
												}
											)}
										</div>
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</Popover>
			)}
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
	);
};

export const FileListSection = () => {
	const { files, addFiles } = useFileStagingContext();

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
			rows={FileRow}
			actions={FileActions}
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
