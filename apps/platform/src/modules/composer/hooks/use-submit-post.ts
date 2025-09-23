'use client';

import { api } from '@/deps/trpc/react';
import { type JSONContent } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from 'sonner';
import {
	type StagedFile,
	useFileStagingContext
} from '../../file/contexts/file-staging-provider';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useComposerController } from '../contexts/composer-controller-provider';

export const useSubmitPost = () => {
	const { body, setBody } = useComposerBodyContext();
	const { files, setFiles } = useFileStagingContext();
	const { topicId, replyToId, setLocked } = useComposerController();
	const router = useRouter();
	const utils = api.useUtils();

	const { mutateAsync: makeUploadUrl } = api.file.makeUploadUrl.useMutation();
	const { mutateAsync: linkToPost } = api.file.linkToPost.useMutation();
	const { mutateAsync: createPost } = api.post.createPost.useMutation();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const uploadFileToS3 = async (file: StagedFile) => {
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

	const handleSubmit = async (overrides?: {
		bodyOverride?: JSONContent;
		filesOverride?: StagedFile[];
		replyToIdOverride?: string;
	}) => {
		const { bodyOverride, filesOverride, replyToIdOverride } = overrides ?? {};

		setIsSubmitting(true);
		setLocked(true);
		const post = await createPost({
			body: bodyOverride ?? body,
			topicId: topicId,
			replyToId: replyToIdOverride ?? replyToId
		});

		const filesToUpload = filesOverride ?? files;

		if (filesToUpload.length > 0) {
			try {
				// upload files to s3
				const uploadedFiles = await Promise.all(
					filesToUpload.map(uploadFileToS3)
				);

				// link files to post
				await linkToPost({
					files: uploadedFiles.map((file) => ({
						key: file.key,
						postId: post.id,
						contentType: file.file.type,
						size: file.file.size,
						documentOptions: {
							academicYear: file.documentOptions.academicYear ?? undefined,
							title: file.name,
							types: file.documentOptions.types ?? []
						}
					}))
				});
			} catch (error) {
				console.error(error);
				toast.error('Greška pri uploadanju datoteka', {
					description: 'Molimo pokušajte ponovo'
				});
				setIsSubmitting(false);
				setLocked(false);
				return;
			}
		}

		// invalidate queries
		await utils.post.getPostById.invalidate({ postId: post.id });

		// invalidate replies cache
		if (replyToId) {
			await utils.post.listReplies.invalidate({ postId: replyToId });
		}

		// invalidate topic cache (replies counter on top-level posts)
		await utils.post.listByTopicId.invalidate({ topicId });

		setIsSubmitting(false);

		// clear body and files
		if (!bodyOverride) setBody(null);
		if (!filesOverride) setFiles([]);

		setLocked(false);

		router.refresh();

		return post;
	};

	return { handleSubmit, isSubmitting };
};
