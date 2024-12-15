'use client';

import { DocumentFileType } from '@prisma/client';
import { categoryParents } from './document-categories';

export const removeCategoryFromSelectedCategories = (
	selectedCategories: DocumentFileType[],
	categoryToRemove: DocumentFileType
) => {
	// remove category to remove
	const categoriesWithoutCategoryToRemove = selectedCategories.filter(
		(c) => c !== categoryToRemove
	);

	// unselect dependency if all of its parents are unselected, except if it has no parents
	const categoriesWithoutOrphanedDependencies =
		categoriesWithoutCategoryToRemove.filter((c) => {
			const hasNoParents = categoryParents[c].length === 0;
			if (hasNoParents) return true;

			const anyOfParentsSelected = categoryParents[c].some((p) =>
				categoriesWithoutCategoryToRemove.includes(p)
			);

			return anyOfParentsSelected;
		});

	return categoriesWithoutOrphanedDependencies;
};
