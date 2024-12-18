import type { ProfessorReference, Subject } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { shortenList } from '@/utils/shorten-list';
import type { ElementHandle, Page } from 'puppeteer';

const processRow = async (
	page: Page,
	row: ElementHandle,
	baseUrl: string
): Promise<Subject> => {
	const subjectEcts = await (await row.$(
		'& > td:nth-child(1) > span'
	))!.evaluate((el) => el.textContent?.split('(')[0].trim() || '0');

	const subjectName = await (
		await row.$('& > td:nth-child(2) > a')
	)?.evaluate((el) => el?.textContent?.split('(')[0].trim() || '')!;

	const subjectCode = await (
		await row.$('& > td:nth-child(2) > a')
	)?.evaluate((el) => el?.textContent?.split('(')[0].trim() || '')!;

	const subjectLink =
		baseUrl +
		(await (
			await row.$('& > td:nth-child(2) > a')
		)?.evaluate((el) => el?.getAttribute('href') || '')!);

	const subjectShortName = subjectLink.split('/').pop()?.split('_')[0] || '';

	// Open info modal
	const buttonEl = (await row.$('td:last-child > a'))!;
	await buttonEl.click();
	await page.waitForSelector('#lightbox_iframe');
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const iFrame = await (await page.$('iframe#lightbox_iframe'))!.contentFrame();

	// Get professors
	const professorReferences: ProfessorReference[] = [];

	const linchargeProfessors = await iFrame.$$(
		'table > tbody > tr.lincharge > td:nth-child(2) > a'
	);

	const lecturersProfessors = await iFrame.$$(
		'table > tbody > tr.lecturers > td:nth-child(2) > a'
	);

	const lecturersRolesTr = await iFrame.$(
		'table > tbody > tr.lecturers > td:last-child'
	);
	const lecturersRolesRaw = await lecturersRolesTr?.evaluate(
		(el) => el.outerHTML
	);
	// extract all text that's between "- " and "<"
	const lecturersRoles = lecturersRolesRaw?.match(/(?<=- )(.*)(?=<)/g) || [];

	for await (const professor of linchargeProfessors) {
		const link = await professor.evaluate((el) => el.getAttribute('href'));
		const role = 'Nositelji';

		professorReferences.push({
			role: role,
			link: baseUrl + link
		});
	}

	let professorIndex = -1;
	for await (const professor of lecturersProfessors) {
		professorIndex += 1;
		const link = await professor.evaluate((el) => el.getAttribute('href'));
		const role = lecturersRoles[professorIndex];

		professorReferences.push({
			role: sanitizeTitle(role),
			link: baseUrl + link
		});
	}

	// Close info modal
	// @ts-ignore
	await page.evaluate(() => hide_window());
	await new Promise((resolve) => setTimeout(resolve, 200));

	return {
		externalLink: subjectLink,
		name: subjectName,
		shortName: subjectShortName,
		externalCode: subjectCode,
		ects: Number(subjectEcts),
		professorsLinks: professorReferences
	};
};

export const getSubjectsFromProgramPage = async (
	page: Page,
	baseUrl: string,
	debug?: boolean
): Promise<Subject[]> => {
	// limit to 5 rows
	const rows = (await page.$$('.cms_table_row_0, .cms_table_row_1')).slice(
		0,
		5
	);

	const subjects: Subject[] = [];

	for await (const row of shortenList(rows, {
		enabled: debug,
		maxLength: 5
	})) {
		const subject = await processRow(page, row, baseUrl);
		subjects.push(subject);
	}

	return subjects;
};
