import type { Professor } from '@/types';
import { extractName } from '@/utils/extract-name';
import type { Page } from 'puppeteer';

const nameSelector = 'h1.title';
const imageSelector = '.mainContent figure img';

export const scrapeStaffPageForDetails = async ({
	page,
	baseUrl,
	link
}: {
	page: Page;
	baseUrl: string;
	link: string;
}) => {
	const result = await page.evaluate(
		(nameSelector, imageSelector) => {
			const name = document.querySelector(nameSelector)?.textContent;
			const imageUrl = document
				.querySelector(imageSelector)
				?.getAttribute('src');
			return { name, imageUrl };
		},
		nameSelector,
		imageSelector
	);

	if (!result.name) return;

	const cleanedName = extractName(result.name);

	const staff: Professor = {
		externalLink: link,
		name: cleanedName,
		imageUrl: result.imageUrl ?? null
	};
	return { staff };
};
