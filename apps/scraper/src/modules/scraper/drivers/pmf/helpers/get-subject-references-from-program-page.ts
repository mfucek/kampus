import type { Page } from 'puppeteer';

import type { SubjectReference } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';

export const getSubjectReferencesFromProgramPage = async (
	page: Page,
	baseUrl: string,
	debug?: boolean
) => {
	const result = await page.evaluate((baseUrl) => {
		const contents = Array.from(
			document.querySelectorAll('.ui-tabs-panel:nth-child(n+3) > table > tbody')
		);

		let subjectReferences: SubjectReference[] = [];
		// let outputSubjects: Record<string, Subject> = {};

		// Go through each semester
		for (
			let semesterIndex = 0;
			semesterIndex < contents.length;
			semesterIndex++
		) {
			const content = contents[semesterIndex];
			const rows = Array.from(content.querySelectorAll('& > tr'));

			let sectionTitle = '';

			for (const row of rows) {
				// It is a section title
				if (row.classList.contains('predmet')) {
					sectionTitle =
						row
							.querySelector('& > td:nth-child(2)')
							?.textContent?.trim()
							.split('\n')[0] || '';
					continue;
				}

				// It is a subject
				if (
					row.classList.contains('cms_table_row_0') ||
					row.classList.contains('cms_table_row_1')
				) {
					const subjectLink =
						row
							.querySelector('& > td:nth-child(2) > a')
							?.getAttribute('href') || '';

					subjectReferences.push({
						externalLink: baseUrl + subjectLink,
						semester: semesterIndex + 1,
						groupName: sanitizeTitle(sectionTitle)
					});
				}
			}
		}

		return { subjectReferences };
	}, baseUrl);

	return result.subjectReferences;
};
