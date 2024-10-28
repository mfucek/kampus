import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import { DocumentFileType, FileType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const fileTypeToFileType = (type: string): FileType => {
	if (['image/png', 'image/jpeg'].includes(type)) return 'IMAGE';
	if (['application/pdf'].includes(type)) return 'PDF';
	if (['application/zip'].includes(type)) return 'ARCHIVE';
	throw new Error('Invalid file type');
};

export const useUploadToPost = () => {
	const utils = api.useUtils();
	const router = useRouter();
	const { mutateAsync: makeUploadUrl, isPending: isMakingUploadUrl } =
		api.file.makeUploadUrl.useMutation();

	const { mutateAsync: linkToPost, isPending } =
		api.file.linkToPost.useMutation({
			onSuccess: async () => {
				// Invalidate and refetch relevant queries
				await utils.post.invalidate();
				await utils.post.getTopicPostsById.invalidate();
				await utils.post.listPostsByCollegeSlug.invalidate();

				// Force a re-render of the page
				router.refresh();
			}
		});

	const { toast } = useToast();

	const [files, setFiles] = useState<
		{
			file: File;
			type: FileType;
			key?: string;
			documentOptions?: {
				academicYear?: string;
				title?: string;
				types: DocumentFileType[];
			};
		}[]
	>([]);

	const addFile = async (file: File) => {
		const askForInput = async () => {
			const res = await window.prompt('Please enter the name of the file');
			return res;
		};

		try {
			const type = fileTypeToFileType(file.type);

			let documentOptions:
				| {
						academicYear?: string;
						title?: string;
						types: DocumentFileType[];
				  }
				| undefined = undefined;

			if (type === 'PDF' || type === 'ARCHIVE') {
				documentOptions = {
					academicYear: '',
					title: (await askForInput()) ?? undefined,
					types: []
				};
			}

			setFiles((prev) => [...prev, { file, type, documentOptions }]);
		} catch (error) {
			toast({
				title: 'Nedopušteni tip datoteke',
				description: 'Dopušteni tipovi datoteka su: png, jpeg, pdf, zip',
				variant: 'danger'
			});
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const commitFiles = useCallback(async () => {
		try {
			// get s3 upload url
			const filesWithKeys = await Promise.all(
				files.map(async (file, i) => {
					const { url, key } = await makeUploadUrl(void {}, {});

					// upload file to s3
					fetch(url, {
						method: 'PUT',
						body: file.file,
						headers: { 'Content-Type': file.file.type }
					});

					return {
						...file,
						key
					};
				})
			);

			setFiles(filesWithKeys);

			return filesWithKeys;
		} catch (error) {
			toast({
				title: 'Greška pri uploadu datoteke',
				description: 'Molimo pokušajte ponovo',
				variant: 'danger'
			});
			console.error(error);
		}
	}, [files]);

	const linkFiles = useCallback(
		async (
			files: {
				key: string;
				type: FileType;
				documentOptions?: {
					academicYear?: string;
					title?: string;
					types: DocumentFileType[];
				};
			}[],
			postId: string
		) => {
			setFiles([]);

			try {
				await linkToPost({
					files: files.map((file) => ({
						key: file.key!,
						type: file.type,
						postId,
						documentOptions: {
							academicYear: file.documentOptions?.academicYear ?? undefined,
							title: file.documentOptions?.title ?? undefined,
							types: file.documentOptions?.types ?? []
						}
					}))
				});
			} catch (error) {
				toast({
					title: 'Greška pri linkanju datoteke',
					description: 'Molimo pokušajte ponovo',
					variant: 'danger'
				});
				console.error(error);
				console.error(files);
			}
		},
		[files]
	);

	return {
		files,
		isPending,
		addFile,
		removeFile,
		commitFiles,
		linkFiles
	};
};
