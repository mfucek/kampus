import { Page } from 'puppeteer';

import { checkImage } from '@/utils/check-image';
import { sanitizeTitle } from '@/utils/sanitize-title';
import type { shortenList } from '@/utils/shorten-list';
import { slugify } from '@/utils/slugify';

declare global {
	interface Window {
		slugify: typeof slugify;
		sanitizeTitle: typeof sanitizeTitle;
		checkImage: typeof checkImage;
		shortenList: typeof shortenList;
	}
}

export const hydrateWindowWithUtilFunctions = async (page: Page) => {
	await page.addScriptTag({
		content: `
			window.slugify = ${slugify.toString()};
			window.sanitizeTitle = ${sanitizeTitle.toString()};
			window.checkImage = ${checkImage.toString()};
		`
	});
};
