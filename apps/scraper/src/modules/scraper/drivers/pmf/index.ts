import puppeteer from 'puppeteer';

import { hydrateWindowWithUtilFunctions } from '@/lib/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/scraper/drivers/types';
import type { Professor, Program, Subject } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { shortenList } from '@/utils/shorten-list';
import { slugify } from '@/utils/slugify';
import { getSubjectReferencesFromProgramPage } from './helpers/get-subject-references-from-program-page';
import { getSubjectsFromProgramPage } from './helpers/get-subjects-from-program-page';

export const pmfDriver: Driver = async ({ debug = false, callbacks }) => {
	// Initialize browser
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

	const programsList: { [externalLink: string]: Program } = {};
	const subjectsList: { [externalLink: string]: Subject } = {};
	const professorsList: { [externalLink: string]: Professor } = {};

	// -----------------------------
	// Scrape programs

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
				selector: 'ul#nav_95985_27 > li:first-child > a.nav_link'
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

	const numOfPagesToScrape = 16;
	let counter = 0;

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
				`Gathering links for ${department} ${programType}`
			);

			if (page.url() !== url) {
				await page.goto(url);
				await hydrateWindowWithUtilFunctions(page);
			}

			(
				await page.evaluate(
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
				)
			).forEach(({ link, name }) => {
				programsList[link] = {
					name: sanitizeTitle(name),
					shortName: slugify(name),
					externalLink: link,
					departments: [],
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

	for await (const program of shortenList(Object.values(programsList), {
		enabled: debug,
		maxLength: 5
	})) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			numOfPrograms,
			`Getting subjects from ${program.name}`
		);

		await page.goto(program.externalLink);
		await hydrateWindowWithUtilFunctions(page);

		// if table exists
		const tableExists = await page.evaluate(() => {
			return (
				document.querySelector('.cms_table_row_1 > td:last-child > a') !== null
			);
		});

		if (!tableExists) {
			continue;
		}

		const subjectReferences = await getSubjectReferencesFromProgramPage(
			page,
			baseUrl,
			debug
		);

		program.subjects = subjectReferences;

		const subjects = await getSubjectsFromProgramPage(page, baseUrl, debug);

		Object.values(subjects).forEach((subject) => {
			subjectsList[subject.externalLink] = subject;
		});
	}

	// -----------------------------
	// Get all unique subject links

	// const subjectLinks = [
	// 	...new Set(
	// 		Object.values(programsList).flatMap((program) =>
	// 			program.subjects.map((subject) => subject.externalLink)
	// 		)
	// 	)
	// ];

	// -----------------------------
	// Scrape each subject link

	// counter = 0;

	// for await (const subjectLink of shortenList(subjectLinks, {
	// 	enabled: debug,
	// 	maxLength: 5
	// })) {
	// 	counter += 1;
	// 	callbacks?.onProgress?.(
	// 		counter,
	// 		debug ? 5 : subjectLinks.length,
	// 		'Getting subject details'
	// 	);

	// 	await page.goto(subjectLink);
	// 	await hydrateWindowWithUtilFunctions(page);

	// 	const result = await page.evaluate(
	// 		(subjectLink, baseUrl) => {
	// 			const subjectName =
	// 				document
	// 					.querySelector('.portlet_news > h3.cms_module_title')
	// 					?.textContent?.trim() || '';

	// 			const subjectCode =
	// 				document
	// 					.querySelector('table > tbody > tr:nth-child(1) > td:nth-child(2)')
	// 					?.textContent?.split('\n')[1]
	// 					.trim() || '';

	// 			const subjectEcts = Number(
	// 				document
	// 					.querySelector('table > tbody > tr:nth-child(2) > td:nth-child(2)')
	// 					?.textContent?.trim() || '0'
	// 			);

	// 			const subjectShortName =
	// 				subjectLink.split('/').pop()?.split('_')[0] || '';

	// 			const professorRoleList: { professor: Professor; role: string }[] = [];

	// 			document
	// 				.querySelectorAll(
	// 					'table > tbody > tr.lincharge > td:nth-child(2) > a'
	// 				)
	// 				.forEach((anchor) => {
	// 					const name = anchor.textContent?.trim() || '';
	// 					const link = anchor.getAttribute('href') || '';
	// 					professorRoleList.push({
	// 						professor: {
	// 							name: name,
	// 							externalLink: baseUrl + link,
	// 							imageUrl: null
	// 						},
	// 						role: 'Nositelji'
	// 					});
	// 				});
	// 			document
	// 				.querySelectorAll(
	// 					'table > tbody > tr.lincharge > td:nth-child(2) > a'
	// 				)
	// 				.forEach((anchor, anchorIndex) => {
	// 					const name = anchor.textContent?.trim() || '';
	// 					const link = anchor.getAttribute('href') || '';
	// 					const role = document
	// 						.evaluate(
	// 							`//tr[@class="lecturers"]/td/a[${
	// 								anchorIndex + 1
	// 							}]/following-sibling::text()`,
	// 							document,
	// 							null,
	// 							XPathResult.STRING_TYPE
	// 						)
	// 						.stringValue.split('- ')[1];

	// 					professorRoleList.push({
	// 						professor: {
	// 							name: name,
	// 							externalLink: baseUrl + link,
	// 							imageUrl: null
	// 						},
	// 						role: sanitizeTitle(role)
	// 					});
	// 				});

	// 			return {
	// 				subject: {
	// 					externalLink: subjectLink,
	// 					name: subjectName,
	// 					shortName: subjectShortName,
	// 					externalCode: subjectCode,
	// 					ects: Number(subjectEcts),
	// 					professorsLinks: professorRoleList.map((p) => ({
	// 						role: p.role,
	// 						link: p.professor.externalLink
	// 					}))
	// 				},
	// 				professors: professorRoleList
	// 			};
	// 		},
	// 		subjectLink,
	// 		baseUrl
	// 	);

	// 	subjectsList[subjectLink] = result.subject;

	// 	for (const professor of result.professors) {
	// 		professorsList[professor.professor.externalLink] = professor.professor;
	// 	}
	// }

	// -----------------------------

	return {
		programs: Object.values(programsList),
		professors: Object.values(professorsList),
		subjects: Object.values(subjectsList)
	};
};
