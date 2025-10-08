import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { DriverCallbacks, Professor } from '@/types';
import type { Logger } from '@/utils/logger';
import { shortenList } from '@/utils/shorten-list';
import type { Page } from 'puppeteer';

const processPage = async ({
	page,
	link,
	logger,
	baseUrl
}: {
	link: string;
	page: Page;
	logger?: Logger;
	baseUrl: string;
}) => {
	logger?.log('info', 'Navigating to ' + link);
	await page.goto(link);
	await hydrateWindowWithUtilFunctions(page);

	logger?.log('info', 'Scraping professor info');

	const nameEls = await page.$$('#person_name');
	let names = await Promise.all(
		nameEls.map(async (el) => {
			return await el.evaluate((el) => el.textContent!);
		})
	);

	logger?.log(
		'info',
		'Found ' + nameEls.length + ' names. ' + names.join('\n')
	);

	const name = names
		.join(' ')
		// remove postnominal letters
		?.split(',')[0]
		// remove title
		?.split('.')
		.reverse()[0]
		// remove trailing whitespace
		?.trim();

	if (!name) {
		logger?.log('warn', 'No name found for ' + link);
		return null;
	}

	logger?.log('info', 'Found name: ' + name);

	const imageEl = await page.$('.portfolio_image');
	const imageSrc = await imageEl?.evaluate((el) => el.getAttribute('src'));

	if (!imageSrc) {
		logger?.log('warn', 'No image found for ' + link);
	}

	const imageUrl = imageSrc ? baseUrl + imageSrc : null;

	return { name, imageUrl, externalLink: link };
};

export const getStaffDetails = async ({
	page,
	links,
	logger,
	baseUrl,
	debug,
	callbacks
}: {
	links: string[];
	page: Page;
	logger?: Logger;
	baseUrl: string;
	debug?: boolean;
	callbacks?: DriverCallbacks;
}) => {
	let counter = 0;
	const numOfLinks = links.length;

	const professorsList: Record<string, Professor> = {};

	for await (const link of shortenList(links, {
		enabled: debug,
		maxLength: 5
	})) {
		counter += 1;
		callbacks?.onProgress?.(counter, numOfLinks, `Scraping professor links`);

		logger?.log('info', 'Navigating to ' + link);
		await page.goto(link);
		await hydrateWindowWithUtilFunctions(page);

		logger?.log('info', 'Scraping professor info');
		const result = await processPage({
			link,
			page,
			logger,
			baseUrl
		});

		if (!result) {
			logger?.log(
				'warn',
				'Incomplete professor info for ' + link + ' ... skipping'
			);
			continue;
		}

		logger?.log('info', 'Saving professor info');
		professorsList[link] = result;
	}

	return professorsList;
};
