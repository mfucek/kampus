import { hydrateWindowWithUtilFunctions } from '@/lib/puppeteer/utils/hydrate-window-with-util-functions';
import type { ProfessorReference, Subject, SubjectReference } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { shortenList } from '@/utils/shorten-list';
import { slugify } from '@/utils/slugify';
import type { Browser } from 'puppeteer';

const visitedSubjectModalUrls = new Set<string>();

export const getSubjectsFromProgramPage = async ({
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
	const subjects: Subject[] = [];
	const subjectReferences: SubjectReference[] = [];

	const page = (await browser.pages())[0];
	await page.goto(url);
	await hydrateWindowWithUtilFunctions(page);

	const semesterContent = await page.$$('.ui-tabs-panel:nth-child(n+3)');

	let semesterNumber = 0;
	for await (const semester of shortenList(semesterContent, {
		enabled: debug,
		maxLength: 3
	})) {
		semesterNumber += 1;
		const rows = await semester.$$('tr');

		let sectionTitle = '';
		for await (const row of shortenList(rows, {
			enabled: debug,
			maxLength: semesterNumber === 1 ? 8 : 1
		})) {
			const isSectionRow = await row.evaluate((row) => {
				return row.classList.contains('predmet');
			});
			const isSubjectRow = await row.evaluate((row) => {
				return (
					row.classList.contains('cms_table_row_0') ||
					row.classList.contains('cms_table_row_1')
				);
			});

			// handle section row
			if (isSectionRow) {
				let newSectionTitle = await row.$eval(
					'td:nth-child(2)',
					(el) => el.textContent ?? null
				);
				if (newSectionTitle) {
					// get rid of description
					newSectionTitle = newSectionTitle.split('\n')[0];

					sectionTitle = newSectionTitle;
				}
				continue;
			}

			// handle subject row
			if (!isSubjectRow) {
				continue;
			}

			const subjectName = (
				await row.$eval(
					'td:nth-child(2) > a',
					(el) => el.textContent?.trim() ?? ''
				)
			).split(' (')[0];

			const subjectLink = await row.$eval(
				'td:nth-child(2) > a',
				(el) => el.href
			);

			const infoModalUrl =
				baseUrl +
				(await row.$eval('td:last-child > a', (el) => el.href))
					.split("'")[1]
					.split("'")[0];

			if (!visitedSubjectModalUrls.has(infoModalUrl)) {
				const subjectData: Subject = {
					externalLink: subjectLink,
					name: sanitizeTitle(subjectName),
					shortName: slugify(subjectName),
					externalCode: '',
					ects: null,
					professorsLinks: []
				};

				subjectReferences.push({
					externalLink: subjectLink,
					semester: semesterNumber,
					groupName: sanitizeTitle(sectionTitle)
				});

				// open subject info modal
				const modalPage = await browser.newPage();
				await modalPage.goto(infoModalUrl);
				await hydrateWindowWithUtilFunctions(modalPage);

				const subjectCode = await modalPage.$eval(
					'table > tbody > tr:nth-of-type(1) > td:last-child',
					(el) => el.textContent?.trim() ?? ''
				);
				const subjectEcts = await modalPage.$eval(
					'table > tbody > tr:nth-of-type(2) > td:last-child',
					(el) => el.textContent?.trim() ?? ''
				);

				const professorReferences = await modalPage.$$eval(
					'table > tbody > .lincharge a',
					(els) => {
						return els.map(
							(el) =>
								({
									link: el.href,
									role: 'Nositelji'
								} satisfies ProfessorReference)
						);
					}
				);

				visitedSubjectModalUrls.add(infoModalUrl);
				await modalPage.close();

				subjectData.externalCode = subjectCode;
				subjectData.ects = subjectEcts ? parseInt(subjectEcts) : null;
				subjectData.professorsLinks = professorReferences;

				subjects.push(subjectData);
			}
		}
	}

	return { subjects, subjectReferences };
};
