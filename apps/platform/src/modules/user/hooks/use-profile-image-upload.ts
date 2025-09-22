import { api } from '@/deps/trpc/react';
import { useState } from 'react';
import { toast } from 'sonner';

export const useProfileImageUpload = () => {
	const maxSize = 5 * 1024 ** 2;

	const { mutateAsync: getPresignedUrl } =
		api.user.profilePicture.getUploadUrl.useMutation();

	const { mutateAsync: uploadProfilePicture } =
		api.user.profilePicture.uploadProfilePicture.useMutation();

	const [uploading, setUploading] = useState(false);

	const handleUpload = async (file: File) => {
		const { url, key } = await getPresignedUrl();
		if (!url) throw new Error('No presigned URL');

		if (maxSize && file.size > maxSize) {
			throw new Error('File too large');
		}

		setUploading(true);

		try {
			await fetch(url, {
				method: 'PUT',
				body: file,
				headers: { 'Content-Type': file.type }
			});

			setUploading(false);

			await onSuccess(key);
		} catch (error) {
			toast.error('Error uploading profile picture', {
				description: JSON.stringify(error)
			});
		}
	};

	const openFilePicker = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/png, image/jpeg';
		input.onchange = async (e) => {
			const files = (e.target as HTMLInputElement).files;
			const file = files?.[0];
			if (!file) return;

			await handleUpload(file);
		};
		input.click();
	};

	const utils = api.useUtils();

	const onSuccess = async (key: string) => {
		try {
			await uploadProfilePicture({ key });
			await utils.user.profilePicture.sessionUser.getUrl.invalidate();
			toast.success('Profilna slika ažurirana', {
				description: 'Tvoja profilna slika je uspješno ažurirana!'
			});
		} catch (error) {
			console.error('Error uploading profile picture:', error);
			toast.error('Pogreška', {
				description: 'Pogreška pri ažuriranju profilne slike'
			});
		}
	};

	return { handleUpload, uploading, openFilePicker };
};
