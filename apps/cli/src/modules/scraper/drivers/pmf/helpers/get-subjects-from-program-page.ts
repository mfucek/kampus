import { hydrateWindowWithUtilFunctions } from '@/deps/puppeteer/utils/hydrate-window-with-util-functions';
import type { DriverCallbacks, ProfessorReference, Subject } from '@/types';
import type { Logger } from '@/utils/logger';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { shortenList } from '@/utils/shorten-list';
import type { Browser, ElementHandle, Page } from 'puppeteer';

const processSubjectRow = async ({
	page,
	row,
	baseUrl,
	logger,
	browser
}: {
	page: Page;
	row: ElementHandle;
	baseUrl: string;
	logger?: Logger;
	browser: Browser;
}): Promise<Subject> => {
	// Subject name
	const subjectName = await (
		await row.$('& > td:nth-child(2) > a')
	)?.evaluate((el) => el?.textContent?.split('(')[0].trim() || '')!;

	// Subject link
	const subjectLink =
		baseUrl +
		(await (
			await row.$('& > td:nth-child(2) > a')
		)?.evaluate((el) => el?.getAttribute('href') || '')!);

	const subjectShortName = subjectLink.split('/').pop()?.split('_')[0] || '';

	// Find modal button
	const anchorTagEls = await row.$$('a');
	let modalContentHref: string | null = null;

	// find js code in href attribute
	for await (const anchorTagEl of anchorTagEls) {
		const href = await anchorTagEl.evaluate((el) => el.getAttribute('href'));
		if (href?.includes('show_window')) {
			try {
				modalContentHref = href.split("'")[1];
				modalContentHref = baseUrl + modalContentHref;
			} catch (error) {
				logger?.log('error', 'Error parsing modal content href');
			}
			break;
		}
	}

	if (!modalContentHref) {
		logger?.log(
			'error',
			'No button found on ' + page.url() + ' ' + subjectName
		);
		throw new Error('No button found on ' + page.url() + ' ' + subjectName);
	}

	logger?.log('info', 'Modal content href: ' + modalContentHref);

	const modalPage = await browser.newPage();

	// Open info modal content
	await modalPage.goto(modalContentHref);
	await hydrateWindowWithUtilFunctions(modalPage);

	// Subject code
	const subjectCode =
		(await (
			await modalPage.$('table > tbody > tr:first-child > td:last-child')
		)?.evaluate((el) => el?.textContent?.trim() || '')) || '';

	// Subject ECTS
	const subjectEcts =
		(await (
			await modalPage.$('table > tbody > tr:nth-child(2) > td:last-child')
		)?.evaluate((el) => el?.textContent?.trim() || '')) || '';

	// Professors
	const professorReferences: ProfessorReference[] = [];

	const linchargeProfessors = await modalPage.$$(
		'table > tbody > tr.lincharge > td:nth-child(2) > a'
	);

	const lecturersProfessors = await modalPage.$$(
		'table > tbody > tr.lecturers > td:nth-child(2) > a'
	);

	const lecturersRolesTr = await modalPage.$(
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

		if (!link || link.endsWith('/.')) {
			continue;
		}

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

		if (!link || link.endsWith('/.')) {
			continue;
		}

		professorReferences.push({
			role: sanitizeTitle(role),
			link: baseUrl + link
		});
	}

	// Close info modal page
	await modalPage.close();

	return {
		externalLink: subjectLink,
		name: subjectName,
		shortName: subjectShortName,
		externalCode: subjectCode,
		ects: Number(subjectEcts),
		professorsLinks: professorReferences
	};
};

export const getSubjectsFromProgramPage = async ({
	page,
	baseUrl,
	selector,
	logger,
	callbacks,
	debug,
	browser
}: {
	page: Page;
	baseUrl: string;
	selector: string;
	logger?: Logger;
	callbacks?: DriverCallbacks;
	debug?: boolean;
	browser: Browser;
}): Promise<Subject[]> => {
	const subjects: Subject[] = [];

	logger?.log('info', 'Finding rows with selector ' + selector);

	const rows = await page.$$(
		selector + ' *:is(.cms_table_row_0, .cms_table_row_1)'
	);

	if (rows.length === 0) {
		logger?.log('warn', 'No rows found on ' + page.url());
		return [];
	}

	logger?.log('info', 'Found ' + rows.length + ' rows');

	let counter = 0;
	const totalRows = rows.length;

	for await (const row of shortenList(rows, {
		enabled: debug,
		maxLength: 5
	})) {
		counter += 1;

		logger?.log('info', 'Processing row no ' + counter + ' of ' + totalRows);

		// confirm row is subject by checking if it contains an anchor tag that's href starts with javascript
		const anchorTags = await row.$$('a');
		const isSubject = anchorTags.some((anchor) =>
			anchor.evaluate((el) => el.getAttribute('href')?.startsWith('javascript'))
		);

		if (!isSubject) {
			continue;
		}

		const subject = await processSubjectRow({
			page,
			row,
			baseUrl,
			logger,
			browser
		});
		subjects.push(subject);
	}

	return subjects;
};
