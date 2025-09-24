import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { Professor } from '@/types';
import type { Browser } from 'puppeteer';

export const getStaffDetails = async ({
	browser,
	baseUrl,
	url,
	debug
}: {
	browser: Browser;
	baseUrl: string;
	url: string;
	debug?: boolean;
}) => {
	const page = await browser.newPage();
	await page.goto(url);
	await hydrateWindowWithUtilFunctions(page);

	const name = (
		await page.evaluate(() => {
			const el = document.querySelector('#person_name');
			if (!el) return '';
			return el.textContent?.trim() ?? '';
		})
	)
		.split(',')[0]
		.split('. ')
		.reverse()[0];

	const imageUrl = await page.evaluate(() => {
		const el = document.querySelector<HTMLImageElement>('img.portfolio_image');
		if (!el) return null;
		return el.src;
	});

	const output: Professor = {
		externalLink: url,
		name,
		imageUrl
	};

	await page.close();

	return output;
};
