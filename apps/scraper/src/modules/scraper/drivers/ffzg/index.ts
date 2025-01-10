import puppeteer from 'puppeteer';

import { hydrateWindowWithUtilFunctions } from '@/lib/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/scraper/drivers/types';
import type { Professor, Subject, SubjectReference } from '@/types';
import { checkImage } from '@/utils/check-image';
import { shortenList } from '@/utils/shorten-list';
import { ScraperResult } from '../../result';
import { scrapeCurrentPageForPrograms } from './helpers/scrape-current-page-for-programs';

export const ffzgDriver: Driver = async ({
	debug = false,
	callbacks,
	logger
}) => {
	logger?.log('info', 'Starting FFZG driver');

	// Initialize browser
	const browser = await puppeteer.launch({
		headless: !debug,
		devtools: debug
	});
	const page = await browser.newPage();

	// -----------------------------
	// URLs
	const baseUrl = 'https://theta.ffzg.hr';
	const urlProgramsUndergraduate =
		'https://theta.ffzg.hr/ECTS/Studij/Reformirani?razinaStudijaID=3';
	const urlProgramsIntegrated =
		'https://theta.ffzg.hr/ECTS/Studij/Reformirani?razinaStudijaID=5';
	const urlProgramsGraduate =
		'https://theta.ffzg.hr/ECTS/Studij/Reformirani?razinaStudijaID=4';

	// -----------------------------
	// Initialize lists

	const result = new ScraperResult(logger, callbacks);

	let counter = 0;

	// -----------------------------

	logger?.log('info', 'Scraping programs - start');

	callbacks?.onProgress?.(1, 3, 'Scraping programs');
	logger?.log('info', 'Scraping programs - undergraduate');

	// Undergraduate programs
	await page.goto(urlProgramsUndergraduate);
	await hydrateWindowWithUtilFunctions(page);
	const undergradPrograms = await scrapeCurrentPageForPrograms({
		page,
		baseUrl
	});

	callbacks?.onProgress?.(1, 3, 'Scraping programs');
	logger?.log('info', 'Scraping programs - integrated');

	// Integrated programs
	await page.goto(urlProgramsIntegrated);
	await hydrateWindowWithUtilFunctions(page);
	const integratedPrograms = await scrapeCurrentPageForPrograms({
		page,
		baseUrl
	});

	callbacks?.onProgress?.(2, 3, 'Scraping programs');
	logger?.log('info', 'Scraping programs - graduate');

	// Graduate programs
	await page.goto(urlProgramsGraduate);
	await hydrateWindowWithUtilFunctions(page);
	const graduatePrograms = await scrapeCurrentPageForPrograms({
		page,
		baseUrl
	});

	result.programsList = {
		...result.programsList,
		...undergradPrograms,
		...integratedPrograms,
		...graduatePrograms
	};

	callbacks?.onProgress?.(3, 3, 'Scraping programs');
	logger?.log('info', 'Scraping programs - done');

	// -----------------------------
	// Visit each program link for subjects and professors
	counter = 0;

	logger?.log('info', 'Scraping program pages - start');

	for await (const programLink of shortenList(
		Object.keys(result.programsList),
		{
			enabled: debug,
			maxLength: 2
		}
	)) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 2 : Object.keys(result.programsList).length,
			'Getting subjects from programs'
		);
		logger?.log('info', `Scraping program pages - visiting ${programLink}`);

		await page.goto(programLink);
		await hydrateWindowWithUtilFunctions(page);

		const res = await page.evaluate((baseUrl) => {
			const semesterPanels = document.querySelectorAll(
				'#structure .panel .panel-body'
			);

			const outputSubjects: { [link: string]: Subject } = {};
			const outputProfessors: { [link: string]: Professor } = {};
			const outputSubjectProfessorLinks: { [subjectLink: string]: string[] } =
				{};
			const outputProgramSubjects: SubjectReference[] = [];

			semesterPanels.forEach((semesterPanel, semesterIndex) => {
				const semesterGroupTitles = semesterPanel.querySelectorAll(
					'div:not(:has(table)):not(:has(a))'
				);
				const semesterSubjectGroups = semesterPanel.querySelectorAll('table');

				semesterSubjectGroups.forEach(
					(semesterSubjectGroup, semesterSubjectGroupIndex) => {
						const subjects = semesterSubjectGroup.querySelectorAll('tr');
						let groupName = window.sanitizeTitle(
							semesterGroupTitles[semesterSubjectGroupIndex].textContent
						);
						groupName = groupName.includes('.')
							? groupName.split('. ')[1]
							: groupName;
						groupName = groupName.split(' - ')[0].split(' za Akade')[0];

						subjects.forEach((subject) => {
							const subjectCode =
								subject.querySelector('td:nth-child(1)')?.textContent?.trim() ||
								'';
							const subjectName = window.sanitizeTitle(
								subject.querySelector('td > a')?.textContent
							);
							const subjectLink =
								baseUrl +
									subject.querySelector('td > a')?.getAttribute('href') || '';
							const subjectEcts =
								subject.querySelector('td:nth-child(3)')?.textContent?.trim() ||
								'';

							const professors = subject.querySelectorAll('td > div a');
							const professorLinks = Array.from(professors).map((professor) => {
								const professorLink =
									baseUrl + professor.getAttribute('href') || '';
								const professorName = professor.textContent?.trim() || '';

								outputProfessors[professorLink] = {
									externalLink: professorLink,
									name: professorName,
									imageUrl: '' // will later be visited and filled
								};

								return professorLink;
							});

							outputSubjects[subjectLink] = {
								externalLink: subjectLink,
								name: subjectName,
								ects: Number(subjectEcts),
								shortName: window.slugify(subjectName),
								externalCode: subjectCode,
								professorsLinks: professorLinks.map((link) => ({
									link,
									role: '' // will later be linked
								}))
							};

							outputProgramSubjects.push({
								externalLink: subjectLink,
								semester: semesterIndex + 1,
								groupName: groupName
							});

							outputSubjectProfessorLinks[subjectLink] = professorLinks;
						});
					}
				);
			});

			return {
				subjects: Object.values(outputSubjects),
				professors: Object.values(outputProfessors),
				subjectProfessorLinks: outputSubjectProfessorLinks,
				programSubjects: outputProgramSubjects
			};
		}, baseUrl);

		logger?.log(
			'info',
			`Scraping program page - found ${res.subjects.length} subjects`
		);
		logger?.log(
			'info',
			`Scraping program page - found ${res.professors.length} professors`
		);
		logger?.log(
			'info',
			`Scraping program page - found ${res.programSubjects.length} program to subject references`
		);

		res.professors.forEach((professor) => {
			result.professorsList[professor.externalLink] = professor;
		});

		res.subjects.forEach((subject) => {
			result.subjectsList[subject.externalLink] = subject;
		});

		res.programSubjects.forEach((programSubject) => {
			result.programsList[programLink].subjects.push(programSubject);
		});

		logger?.log('info', `Scraping program page - done`);
	}

	// -----------------------------
	// Go through subjects from results and link professors

	counter = 0;

	for await (const subjectLink of shortenList(
		Object.keys(result.subjectsList),
		{
			enabled: debug,
			maxLength: 3
		}
	)) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 3 : Object.keys(result.subjectsList).length,
			'Linking professors to subjects'
		);

		await page.goto(subjectLink);
		await hydrateWindowWithUtilFunctions(page);

		const professors = await page.evaluate((baseUrl) => {
			const professorsPanel = document.querySelectorAll(
				'.tabcontent .col-xs-6 .panel-body > div > div:has(a)'
			);

			const res = Array.from(professorsPanel).map((professorPanel) => {
				const anchor = professorPanel.querySelector('a');
				const span = professorPanel.querySelector('& > :not(a)');

				const link = baseUrl + anchor?.getAttribute('href') || '';

				const title = window.sanitizeTitle(span?.textContent);

				return { link, title };
			});

			return res;
		}, baseUrl);

		professors.forEach(({ link, title }) => {
			const subject = result.subjectsList[subjectLink];

			if (subject.professorsLinks.find((p) => p.link === link)) {
				subject.professorsLinks.find((p) => p.link === link)!.role = title;
			}
		});
	}

	// -----------------------------
	// Go through professors from results and assign images

	counter = 0;

	for await (const professorLink of shortenList(
		Object.keys(result.professorsList),
		{
			enabled: debug,
			maxLength: 5
		}
	)) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 5 : Object.keys(result.professorsList).length,
			'Assigning images to professors'
		);

		await page.goto(professorLink);
		await hydrateWindowWithUtilFunctions(page);

		const imgUrl = await page.evaluate((baseUrl) => {
			const src = document
				.querySelector('.table > .row img')
				?.getAttribute('src');

			return src;
		}, baseUrl);

		result.professorsList[professorLink].imageUrl =
			imgUrl && (await checkImage(imgUrl)) ? imgUrl : null;
	}

	// -----------------------------

	await browser.close();

	return result.getPayload();
};
