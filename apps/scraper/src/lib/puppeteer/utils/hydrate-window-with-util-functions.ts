import { checkImage } from '@/utils/check-image';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { Page } from 'puppeteer';
import { slugify } from '../../../utils/slugify';

declare global {
	interface Window {
		slugify: (str: string) => string;
		sanitizeTitle: (str: string | undefined | null) => string;
		checkImage: (url: string) => Promise<boolean>;
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
