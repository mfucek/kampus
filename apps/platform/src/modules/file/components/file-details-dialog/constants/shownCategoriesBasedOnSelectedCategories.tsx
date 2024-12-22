'use client';

import { type DocumentFileType } from '@prisma/client';

import { mainCategories, subCategories } from './document-categories';

export const shownCategoriesBasedOnSelectedCategories = (
	selectedCategories: DocumentFileType[]
) => {
	const output: DocumentFileType[] = [];

	for (const category of mainCategories) {
		output.push(category);
		if (subCategories[category] && selectedCategories.includes(category)) {
			output.push(...subCategories[category]);
		}
	}

	return [...new Set(output)];
};
