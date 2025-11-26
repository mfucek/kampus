import puppeteer from 'puppeteer';

import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/scraper/drivers/types';
import { smartParallelBatch } from '@/utils/parallel-batch';
import { shortenList } from '@/utils/shorten-list';
import { ScraperResult } from '../../result';
import { scrapeModulePageForPrograms } from './helpers/scrape-module-page-for-programs';
import { scrapePageForSubjectReferences } from './helpers/scrape-page-for-subject-references';
import { scrapeStaffPageForDetails } from './helpers/scrape-staff-page-for-details';
import { scrapeSubjectPageForDetails } from './helpers/scrape-subject-page-for-details';

export const ttfDriver: Driver = async ({
	debug = false,
	callbacks,
	logger
}) => {
	logger?.log('info', 'Starting TTF driver');

	// Initialize browser
	const browser = await puppeteer.launch({
		headless: !debug,
		devtools: debug
	});
	const page = await browser.newPage();

	// -----------------------------
	// URLs

	const baseUrl = 'https://www.ttf.unizg.hr';
	const modules = [
		{
			name: 'Tekstilni i modni dizajn',
			groups: [
				{
					type: 'Preddiplomski studiji',
					url: 'https://www.ttf.unizg.hr/sveucilisni-prijediplomski-studij/139',
					selectorPrograms:
						'#app > div.contentWrapper > div > article > div.primaryContent > div > div > div.linkedPagesComponent.cf.withCols > ul > li > a'
				},
				{
					type: 'Diplomski studiji',
					url: 'https://www.ttf.unizg.hr/sveucilisni-diplomski-studij/142',
					selectorPrograms:
						'#app > div.contentWrapper > div > article > div.primaryContent > div > div > div.linkedPagesComponent.cf.withCols > ul > li > a'
				}
			]
		},
		{
			name: 'Tekstilna tehnologija i inženjerstvo',
			groups: [
				{
					type: 'Preddiplomski studiji',
					url: 'https://www.ttf.unizg.hr/sveucilisni-prijediplomski-studij/148',
					selectorPrograms:
						'#app > div.contentWrapper > div > article > div.primaryContent > div > div > div.linkedPagesComponent.cf.withCols > ul > li > a'
				},
				{
					type: 'Diplomski studiji',
					url: 'https://www.ttf.unizg.hr/sveucilisni-diplomski-studij/153',
					selectorPrograms:
						'#app > div.contentWrapper > div > article > div.primaryContent > div > div > div.linkedPagesComponent.cf.withCols > ul > li > a'
				}
			]
		},
		{
			name: 'Tekstilna, odjevna i obućarska tehnologija',
			groups: [
				{
					type: 'Preddiplomski studiji',
					url: 'https://www.ttf.unizg.hr/strucni-prijediplomski-studij/159',
					selectorPrograms:
						'#app > div.contentWrapper > div > article > div.primaryContent > div > div > div.linkedPagesComponent.cf.withCols > ul > li > a'
				}
			]
		}
	];

	// -----------------------------
	// Initialize lists

	const result = new ScraperResult(logger, callbacks);

	const uniqueSubjectLinks = new Set<string>();
	const uniqueStaffLinks = new Set<string>();

	// -----------------------------

	logger?.log('info', 'Scraping programs - start');
	let counter = 0;

	const numberOfGroups = modules.reduce(
		(acc, module) => acc + module.groups.length,
		0
	);

	for await (const module of modules) {
		for await (const group of module.groups) {
			counter += 1;
			callbacks?.onProgress?.(counter, numberOfGroups, `Scraping modules`);

			logger?.log('info', 'Navigating to ' + group.url);
			await page.goto(group.url);
			await hydrateWindowWithUtilFunctions(page);

			// 1. get links to programs from module page
			const programScrapeResult = await scrapeModulePageForPrograms({
				page,
				baseUrl,
				selectorProgramCards: group.selectorPrograms,
				type: group.type,
				moduleTitle: module.name
			});

			logger?.log(
				'info',
				'Found ' +
					Object.keys(programScrapeResult.programsList).length +
					' programs'
			);

			// 2. identify & scrape common subjects that are present in all programs in this module
			const commonSubjectReferences = await scrapePageForSubjectReferences({
				page,
				baseUrl,
				offset: 0,
				logger
			});

			logger?.log(
				'info',
				`Found ${commonSubjectReferences.subjectReferences.length} common subject references`
			);

			// 3. add unique subject links to set
			commonSubjectReferences.subjectReferences.forEach((subjectReference) => {
				uniqueSubjectLinks.add(subjectReference.externalLink);
			});

			// 4. expand scraped program list with common subject references
			Object.values(programScrapeResult.programsList).forEach((program) =>
				program.subjects.push(...commonSubjectReferences.subjectReferences)
			);

			// 5. push found programs to result
			result.programsList = {
				...result.programsList,
				...programScrapeResult.programsList
			};
		}
	}

	logger?.log('info', 'Scraping programs - done');

	// -----------------------------
	// Visit each program link for subjects

	logger?.log('info', 'Scraping program pages - start');

	const programs = Object.entries(result.programsList);

	await smartParallelBatch(
		shortenList(programs, {
			enabled: debug,
			maxLength: 5
		}),
		3,
		async (programs, index, total) => {
			callbacks?.onProgress?.(index, total, 'Scraping program pages');

			await Promise.all(
				programs.map(async ([programLink, program]) => {
					logger?.log('info', 'Navigating to ' + programLink);
					const page = await browser.newPage();
					await page.goto(programLink);
					await page.waitForNetworkIdle();
					await hydrateWindowWithUtilFunctions(page);

					// 1. start off semester counting from after the common module subjects
					const largestSemesterNumber =
						program.subjects.length > 0
							? Math.max(
									...program.subjects.map(
										(subjectReference) => subjectReference.semester
									)
							  )
							: 0;

					logger?.log(
						'info',
						`Largest common semester number: ${largestSemesterNumber} for program ${programLink}`
					);

					// 2. scrape subject references from program page
					const scrapeResult = await scrapePageForSubjectReferences({
						page,
						baseUrl,
						offset: largestSemesterNumber,
						logger
					});

					logger?.log(
						'info',
						'Found ' +
							scrapeResult.subjectReferences.length +
							' program to subject references'
					);

					// 3. add subject references to program
					program.subjects.push(...scrapeResult.subjectReferences);

					// 4. add unique subject links to set
					scrapeResult.subjectReferences.forEach((reference) => {
						uniqueSubjectLinks.add(reference.externalLink);
					});

					await page.close();
				})
			);
		}
	);

	callbacks?.onProgress?.(0, 1, 'Scraping program pages');
	logger?.log('info', 'Scraping program pages - done');

	// -----------------------------
	// Visit each subject link for professors

	logger?.log('info', `Total ${uniqueSubjectLinks.size} unique subject links`);

	await smartParallelBatch(
		shortenList(Array.from(uniqueSubjectLinks), {
			enabled: debug,
			maxLength: 20
		}),
		5,
		async (subjectLinks, index, total) => {
			callbacks?.onProgress?.(index, total, 'Scraping subject pages');
			await Promise.all(
				subjectLinks.map(async (subjectLink) => {
					logger?.log('info', 'Navigating to ' + subjectLink);
					const page = await browser.newPage();
					await page.goto(subjectLink);
					await page.waitForNetworkIdle();
					await hydrateWindowWithUtilFunctions(page);

					// 1. scrape subject details from subject page
					const scrapeResult = await scrapeSubjectPageForDetails({
						page,
						baseUrl,
						link: subjectLink,
						logger
					});

					if (!scrapeResult) {
						logger?.log(
							'warn',
							'Incomplete subject info for ' + subjectLink + ' ... skipping'
						);
						await page.close();
						return null;
					}

					// 2. add subject to result
					result.subjectsList[subjectLink] = scrapeResult.subject;

					// 3. add unique staff links to set
					scrapeResult.subject.professorsLinks.forEach((link) => {
						uniqueStaffLinks.add(link.link);
					});

					await page.close();
				})
			);
		}
	);

	callbacks?.onProgress?.(0, 1, 'Scraping subject pages');
	logger?.log('info', 'Scraping subject pages - done');

	// -----------------------------

	logger?.log('info', `Total ${uniqueStaffLinks.size} unique staff links`);

	await smartParallelBatch(
		shortenList(Array.from(uniqueStaffLinks), {
			enabled: debug,
			maxLength: 20
		}),
		5,
		async (staffLinks, index, total) => {
			callbacks?.onProgress?.(index, total, 'Scraping staff pages');
			await Promise.all(
				staffLinks.map(async (staffLink) => {
					logger?.log('info', 'Navigating to ' + staffLink);
					const page = await browser.newPage();
					await page.goto(staffLink);
					await page.waitForNetworkIdle();
					await hydrateWindowWithUtilFunctions(page);

					// 1. scrape staff details from staff page
					const scrapeResult = await scrapeStaffPageForDetails({
						page,
						baseUrl,
						link: staffLink
					});
					if (!scrapeResult) {
						logger?.log(
							'warn',
							'Incomplete staff info for ' + staffLink + ' ... skipping'
						);
						await page.close();
						return null;
					}

					// 2. add staff to result
					result.professorsList[staffLink] = scrapeResult.staff;

					await page.close();
				})
			);
		}
	);

	// -----------------------------

	return result.getPayload();
};
