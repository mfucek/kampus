import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import { useState } from 'react';

export const useProfileImageUpload = () => {
	const maxSize = 5 * 1024 ** 2;

	const { mutateAsync: getPresignedUrl } =
		api.account.getUploadUrl.useMutation();

	const { mutateAsync: uploadProfilePicture } =
		api.account.uploadProfilePicture.useMutation();

	const { toast } = useToast();

	const [uploading, setUploading] = useState(false);

	const handleUpload = async (file: File) => {
		const { url, key } = await getPresignedUrl();
		if (!url) throw new Error('No presigned URL');

		if (maxSize && file.size > maxSize) {
			throw new Error('File too large');
		}

		setUploading(true);

		try {
			const upload = await fetch(url, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type }
			});

			setUploading(false);

			console.log('uploading', upload);

			onSuccess(key);
		} catch (error) {
			console.error('Error uploading profile picture:', error);
			toast({
				title: 'Error uploading profile picture',
				description: 'Please try again later',
				variant: 'danger'
			});
		}
	};

	const openFilePicker = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const files = (e.target as HTMLInputElement).files;
			const file = files?.[0];
			if (!file) return;

			handleUpload(file);
		};
		input.click();
	};

	const utils = api.useUtils();

	const onSuccess = async (key: string) => {
		await uploadProfilePicture({ key });
		await utils.account.getCurrentUserProfilePictureUrl.invalidate();
	};

	return { handleUpload, uploading, openFilePicker };
};
