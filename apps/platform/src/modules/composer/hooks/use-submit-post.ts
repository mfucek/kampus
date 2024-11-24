'use client';

import { useState } from 'react';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useComposerFilesContext } from '../contexts/composer-files-provider';

export const useSubmitPost = () => {
	const { body } = useComposerBodyContext();
	const { files } = useComposerFilesContext();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		console.log('submit', body, files);
	};

	return { handleSubmit, isSubmitting };
};
