'use client';

import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useComposerController } from '../contexts/composer-controller-provider';
import {
	type PostFile,
	useComposerFilesContext
} from '../contexts/composer-files-provider';

export const useSubmitPost = () => {
	const { body, setBody } = useComposerBodyContext();
	const { files, setFiles } = useComposerFilesContext();
	const { collegeId, topicId, replyToId, setLocked } = useComposerController();
	const { toast } = useToast();
	const router = useRouter();
	const utils = api.useUtils();

	const { mutateAsync: makeUploadUrl } = api.file.makeUploadUrl.useMutation();
	const { mutateAsync: linkToPost } = api.file.linkToPost.useMutation();
	const { mutateAsync: createPost } = api.post.createPost.useMutation();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const uploadFileToS3 = async (file: PostFile) => {
		const { url, key } = await makeUploadUrl(void {}, {});

		// upload file to s3
		await fetch(url, {
			method: 'PUT',
			body: file.file,
			headers: { 'Content-Type': file.file.type }
		});

		return {
			...file,
			key
		};
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setLocked(true);
		const post = await createPost({
			body: body,
			collegeId: collegeId,
			topicId: topicId,
			replyToId: replyToId
		});

		if (files.length > 0) {
			try {
				// upload files to s3
				const uploadedFiles = await Promise.all(files.map(uploadFileToS3));

				// link files to post
				await linkToPost({
					files: uploadedFiles.map((file) => ({
						key: file.key,
						type: file.type,
						postId: post.id,
						documentOptions: {
							academicYear: file.documentOptions?.academicYear ?? undefined,
							title: file.name,
							types: file.documentOptions?.types ?? []
						}
					}))
				});
			} catch (error) {
				console.error(error);
				toast({
					title: 'Greška pri uploadanju datoteka',
					description: 'Molimo pokušajte ponovo',
					variant: 'danger'
				});
				setIsSubmitting(false);
				setLocked(false);
				return;
			}
		}

		// invalidate queries
		await utils.post.invalidate();
		await utils.post.list.invalidate();

		setIsSubmitting(false);

		// clear body and files
		setBody(null);
		setFiles([]);

		setLocked(false);

		router.refresh();
	};

	return { handleSubmit, isSubmitting };
};
