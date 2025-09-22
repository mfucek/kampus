'use client';

import { type DocumentFileType } from '@prisma/client';
import { formatDistance } from 'date-fns';

import { api } from '@/deps/trpc/react';
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
import { useComposerController } from '@/modules/composer/contexts/composer-controller-provider';
import { categoryLabels } from '@/modules/file/components/file-details-dialog/constants/category-labels';
import { removeCategoryFromSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/removeCategoryFromSelectedCategories';
import { shownCategoriesBasedOnSelectedCategories } from '@/modules/file/components/file-details-dialog/constants/shownCategoriesBasedOnSelectedCategories';
import {
	type StagedFile,
	useFileStagingContext
} from '@/modules/file/contexts/file-staging-provider';
import { UploadArea } from '@/modules/file/hooks/use-upload-area';
import { usePostId } from '@/modules/layout/components/post-id-provider';

const FileRow = (file: StagedFile, index: number) => {
	const { updateFile, openFileDetailsDialog } = useFileStagingContext();

	return (
		<>
			<div className="body-2 w-[200px] break-all">{file.name}</div>

			<Select
				// size="xs" variant="outline" rounded
				value={file.documentOptions.academicYear ?? undefined}
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
					{/* @ts-expect-error TODO */}
					<SelectItem value={null}>-</SelectItem>
					{new Array(50).fill(0).map((_, i) => {
						const currentlyInFirstHalfOfCurrentYear = new Date().getMonth() < 6;
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

			<div className="flex flex-row gap-1">
				<Popover>
					{file.documentOptions.types.map((type) => (
						<PopoverTrigger asChild key={type}>
							<Button size="xs" variant="outline" rounded>
								{categoryLabels[type]}
							</Button>
						</PopoverTrigger>
					))}
					<Button
						size="xs"
						variant="outline"
						iconOnly
						rounded
						onClick={() => openFileDetailsDialog(index)}
					>
						<Icon icon="add" />
					</Button>
					<PopoverContent>
						<div className="flex flex-row flex-wrap gap-2">
							{shownCategoriesBasedOnSelectedCategories(
								file.documentOptions.types ?? []
							).map((type) => {
								const isSelected = file.documentOptions.types.includes(type);
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
															file.documentOptions.types ?? [],
															type
														)
													}
												});
											} else {
												updateFile(index, {
													documentOptions: {
														...file.documentOptions,
														types: [...(file.documentOptions.types ?? []), type]
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

	const { data: duplicatesData } =
		api.topic.subject.hasDocumentOfKindProcedure.useQuery(
			{
				types: file.documentOptions.types,
				year: file.documentOptions.academicYear!,
				subjectId: topicId
			},
			{
				enabled:
					!!topicId &&
					!!file.documentOptions.academicYear &&
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
