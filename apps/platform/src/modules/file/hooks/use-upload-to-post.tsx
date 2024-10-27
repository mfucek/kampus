import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import { FileType } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

const fileTypeToFileType = (type: string): FileType => {
	if (['image/png', 'image/jpeg'].includes(type)) return 'IMAGE';
	if (['application/pdf'].includes(type)) return 'PDF';
	if (['application/zip'].includes(type)) return 'ARCHIVE';
	throw new Error('Invalid file type');
};

export const useUploadToPost = () => {
	const { mutateAsync: makeUploadUrl, isPending: isMakingUploadUrl } =
		api.file.makeUploadUrl.useMutation();

	const { mutateAsync: linkToPost, isPending } =
		api.file.linkToPost.useMutation();

	const { toast } = useToast();

	const [files, setFiles] = useState<
		{
			file: File;
			type: FileType;
			key?: string;
		}[]
	>([]);

	useEffect(() => {
		console.log('files');
		console.log(files);
	}, [files]);

	const addFile = (file: File) => {
		try {
			const type = fileTypeToFileType(file.type);

			setFiles((prev) => [...prev, { file, type }]);
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
					console.log('file nr.', i);

					const { url, key } = await makeUploadUrl(void {}, {});
					console.log('url', url);
					console.log('key', key);

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
		async (files: { key: string; type: FileType }[], postId: string) => {
			setFiles([]);
			console.log('linking files');
			console.log(
				files.map((file) => ({
					key: file.key,
					type: file.type,
					postId,
					documentOptions: null
				}))
			);

			try {
				await linkToPost({
					files: files.map((file) => ({
						key: file.key!,
						type: file.type,
						postId,
						documentOptions: null
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
		isPending,
		addFile,
		removeFile,
		commitFiles,
		linkFiles
	};
};
