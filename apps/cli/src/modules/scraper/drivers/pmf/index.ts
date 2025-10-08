import puppeteer from 'puppeteer';

import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/scraper/drivers/types';
import type { Professor, Program, Subject } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { shortenList } from '@/utils/shorten-list';
import { slugify } from '@/utils/slugify';
import { getStaffDetails } from './helpers/get-staff-details';
import { getSubjectReferencesFromProgramPage } from './helpers/get-subject-references-from-program-page';
import { getSubjectsFromProgramPage } from './helpers/get-subjects-from-program-page';

export const pmfDriver: Driver = async ({
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
	const page = (await browser.pages())[0];

	// -----------------------------
	// URLs

	const baseUrl = 'https://www.pmf.unizg.hr';

	// -----------------------------
	// Initialize lists

	logger?.log('info', 'Initializing lists');
	const programsList: { [externalLink: string]: Program } = {};
	const subjectsList: { [externalLink: string]: Subject } = {};
	const professorsList: { [externalLink: string]: Professor } = {};

	// -----------------------------
	// Scrape programs

	logger?.log('info', 'Scraping programs');
	const departmentsUrl: Record<
		string,
		Record<string, { url: string; selector: string }>
	> = {
		Biologija: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/biol/studiji',
				selector: 'ul#nav_95584_144 > li > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/biol/studiji',
				selector: 'ul#nav_95584_149 > li > a.nav_link'
			},
			'Integrirani Studiji': {
				url: 'https://www.pmf.unizg.hr/biol/studiji',
				selector: 'ul#nav_95584_155 > li > a.nav_link'
			}
		},
		Fizika: {
			'Integrirani Studiji': {
				url: 'https://www.pmf.unizg.hr/phy/nastava/predmeti',
				selector: 'ul#nav_124789_8 > li > a.nav_link'
			}
		},
		Kemija: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/chem',
				selector: 'ul#nav_95584_152 > li > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/chem',
				selector: 'ul#nav_95985_29 > li > a.nav_link'
			},
			'Integrirani Studiji': {
				url: 'https://www.pmf.unizg.hr/chem',
				selector: 'ul#nav_95985_40 > li > a.nav_link'
			}
		},
		Matematika: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/math',
				selector: 'ul#nav_95602_19 > li > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/math',
				selector: 'ul#nav_95602_22 > li > a.nav_link'
			},
			'Integrirani Studiji': {
				url: 'https://www.pmf.unizg.hr/math',
				selector: 'ul#nav_95602_18 > li:nth-child(3) > a.nav_link'
			}
		},
		Geofizika: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geof/studiji',
				selector: 'ul#nav_95608_13 > li:first-child > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geof/studiji',
				selector: 'ul#nav_95608_15 > li > a.nav_link'
			}
		},
		Geografija: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geog',
				selector: 'ul#nav_95614_30 > li:first-child > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geog',
				selector: 'ul#nav_95614_32 > li > a.nav_link'
			},
			'Integrirani Studiji': {
				url: 'https://www.pmf.unizg.hr/geog',
				selector: 'ul#nav_95614_30 > li:nth-child(3) > a.nav_link'
			}
		},
		Geologija: {
			'Preddiplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geol',
				selector: 'ul#nav_95620_21 > li:first-child > a.nav_link'
			},
			'Diplomski Studiji': {
				url: 'https://www.pmf.unizg.hr/geol',
				selector: 'ul#nav_95620_24 > li:nth-child(-n+2) > a.nav_link'
			}
		}
	};

	const tablesSelectors: Record<
		string,
		{
			tables: string;
			tableGroups: string;
		}
	> = {
		Biologija: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-of-type(n+2) > table > tbody'
		},
		Fizika: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-child(n+3) > table > tbody'
		},
		Kemija: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-child(n+3) > table > tbody'
		},
		Matematika: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-child(n+3) > table > tbody'
		},
		Geofizika: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-child(n+3) > table > tbody'
		},
		Geografija: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel'
		},
		Geologija: {
			tableGroups: '.ui-tabs',
			tables: '.ui-tabs-panel:nth-child(n+3)'
		}
	};

	const numOfPagesToScrape = 16;
	let counter = 0;

	logger?.log(
		'info',
		'Scraping ' + Object.entries(departmentsUrl).length + ' departments'
	);
	for await (const [department, programUrlsSelector] of shortenList(
		Object.entries(departmentsUrl),
		{ enabled: debug }
	)) {
		for await (const [programType, { url, selector }] of Object.entries(
			programUrlsSelector
		)) {
			counter += 1;
			callbacks?.onProgress?.(
				counter,
				numOfPagesToScrape,
				`Gathering links for ${department}`
			);

			logger?.log('info', 'Navigating to ' + url);
			if (page.url() !== url) {
				await page.goto(url);
				await hydrateWindowWithUtilFunctions(page);
			}

			logger?.log('info', 'Scraping ' + selector);
			const result = await page.evaluate(
				(selector, baseUrl) => {
					const anchors = Array.from(document.querySelectorAll(selector));
					return anchors.map((anchor) => {
						const name = anchor.textContent?.trim() || '';
						const link = anchor.getAttribute('href') || '';
						return { name: name, link: baseUrl + link };
					});
				},
				selector,
				baseUrl
			);

			result.forEach(({ link, name }) => {
				logger?.log('info', 'Found program ' + name);
				programsList[link] = {
					name: sanitizeTitle(name),
					shortName: slugify(name),
					externalLink: link,
					departments: [department],
					subjects: [],
					type: programType
				};
			});
		}
	}

	// -----------------------------
	// Get all subjects for each program

	const numOfPrograms = Object.keys(programsList).length;
	counter = 0;

	logger?.log('info', 'Scraping ' + numOfPrograms + ' programs');
	for await (const program of shortenList(Object.values(programsList), {
		enabled: debug,
		maxLength: 5
	})) {
		counter += 1;
		callbacks?.onProgress?.(counter, numOfPrograms, `Getting subjects`);

		logger?.log('info', 'Navigating to ' + program.externalLink);
		await page.goto(program.externalLink);
		await hydrateWindowWithUtilFunctions(page);

		// if table exists
		const tableExists = await page.evaluate(() => {
			return (
				document.querySelector('.cms_table_row_1 > td:last-child > a') !== null
			);
		});

		if (!tableExists) {
			logger?.log('warn', 'No table element found');
			continue;
		}

		logger?.log('info', 'Scraping subject references from table');
		const subjectReferences = await getSubjectReferencesFromProgramPage({
			page,
			baseUrl,
			tablesSelector: tablesSelectors[program.departments[0]!],
			logger,
			debug
		});

		program.subjects = subjectReferences;

		logger?.log('info', 'Scraping individual subject info from modals');
		const subjects = await getSubjectsFromProgramPage({
			page: page,
			baseUrl: baseUrl,
			selector:
				tablesSelectors[program.departments[0]!].tableGroups +
				' ' +
				tablesSelectors[program.departments[0]!].tables,
			logger: logger,
			callbacks: callbacks,
			debug: debug,
			browser: browser
		});

		logger?.log('info', 'Added ' + Object.keys(subjects).length + ' subjects');
		Object.values(subjects).forEach((subject) => {
			subjectsList[subject.externalLink] = subject;
		});
	}

	// -----------------------------
	// Scrape each professor link

	const professorLinks = [
		...new Set(
			Object.values(subjectsList).flatMap((subject) =>
				subject.professorsLinks.map((p) => p.link)
			)
		)
	];

	const professors = await getStaffDetails({
		links: professorLinks,
		page,
		logger,
		baseUrl,
		debug,
		callbacks
	});

	Object.entries(professors).forEach(([link, professor]) => {
		professorsList[link] = professor;
	});

	// -----------------------------

	return {
		programs: Object.values(programsList),
		professors: Object.values(professorsList),
		subjects: Object.values(subjectsList)
	};
};
