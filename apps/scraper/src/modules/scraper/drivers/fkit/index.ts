import puppeteer from 'puppeteer';

// import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/scraper/drivers/types';
import { shortenList } from '@/utils/shorten-list';
import { ScraperResult } from '../../result';
import { getStaffDetails } from './helpers/get-staff-details';
import { getSubjectsFromProgramPage } from './helpers/get-subjects-from-program-page';
import { handleProgramList } from './helpers/handle-program-list';
// import { sanitizeTitle } from '@/utils/sanitize-title';
// import { shortenList } from '@/utils/shorten-list';
// import { slugify } from '@/utils/slugify';

export const fkitDriver: Driver = async ({
	debug = false,
	logger,
	callbacks
}) => {
	logger?.log('info', 'Starting PMF driver');

	// Initialize browser
	logger?.log('info', 'Initializing browser');
	const browser = await puppeteer.launch({
		headless: !debug,
		devtools: debug
	});

	// -----------------------------
	// URLs

	const baseUrl = 'https://www.fkit.unizg.hr';

	// -----------------------------
	// Initialize lists

	const result = new ScraperResult(logger, callbacks);
	let counter = 0;

	// -----------------------------
	// Scrape programs
	counter = 0;

	const departmentsUrl: Record<
		string,
		Record<string, { url: string; selector: string }>
	> = {
		FKIT: {
			'Preddiplomski Studiji': {
				url: 'https://www.fkit.unizg.hr/preddiplomski',
				selector: '#nav_59464_0 > li:nth-child(-n+4) > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.fkit.unizg.hr/diplomski',
				selector: '#nav_59464_7 > li:nth-child(-n+4) > a.nav_link'
			}
		}
	};

	callbacks?.onProgress?.(0, 1, 'Scraping programs');
	logger?.log('info', 'Scraping programs - start');

	const programs = await handleProgramList({
		browser,
		baseUrl,
		departmentsUrl
	});

	for (const program of programs) {
		logger?.log('info', `Scraped program ${program.externalLink}`);

		result.programsList[program.externalLink] = program;

		counter++;
	}

	callbacks?.onProgress?.(0, 1, 'Scraping programs');
	logger?.log('info', 'Scraping programs - done');

	// -----------------------------
	// Scrape subjects
	counter = 0;

	callbacks?.onProgress?.(
		0,
		Object.values(result.programsList).length,
		`Scraping subjects`
	);
	logger?.log('info', 'Scraping subjects - start');

	const professorUrlSet = new Set<string>();

	for (const { externalLink } of Object.values(result.programsList)) {
		callbacks?.onProgress?.(
			counter,
			Object.values(result.programsList).length,
			`Scraping subjects`
		);
		logger?.log('info', `Scraping subjects - ${externalLink}`);

		const { subjects, subjectReferences } = await getSubjectsFromProgramPage({
			browser,
			baseUrl,
			url: externalLink,
			debug
		});

		// link up subjects to program
		result.programsList[externalLink].subjects = subjectReferences;

		// add subjects
		for (const subject of subjects) {
			for (const professor of subject.professorsLinks) {
				professorUrlSet.add(professor.link);
			}

			result.subjectsList[subject.externalLink] = subject;

			logger?.log('info', `Scraped subject - ${subject.name}`);
		}

		counter++;
	}

	callbacks?.onProgress?.(0, 1, 'Scraping subjects');
	logger?.log('info', 'Scraping subjects - done');

	// -----------------------------
	// Scrape professors
	counter = 0;

	callbacks?.onProgress?.(0, professorUrlSet.size, `Scraping professors`);
	logger?.log('info', 'Scraping professors - start');

	for await (const professorUrl of shortenList(Array.from(professorUrlSet), {
		enabled: debug,
		maxLength: 10
	})) {
		logger?.log('info', `Scraping professor ${professorUrl}`);
		callbacks?.onProgress?.(
			counter,
			professorUrlSet.size,
			`Scraping professors`
		);

		const professor = await getStaffDetails({
			browser,
			baseUrl,
			url: professorUrl,
			debug
		});

		logger?.log('info', `Scraped professor ${professor.name}`);

		result.professorsList[professor.externalLink] = professor;

		counter++;
	}

	callbacks?.onProgress?.(0, 1, 'Scraping professors');
	logger?.log('info', 'Scraping professors - done');

	// -----------------------------

	await browser.close();

	return result.getPayload();
};
