import puppeteer from 'puppeteer';

import { hydrateWindowWithUtilFunctions } from '@/lib/puppeteer/utils/hydrate-window-with-util-functions';
import type { Driver } from '@/modules/driver/types';
import type { Professor, Program, Subject, SubjectReference } from '@/types';
import { checkImage } from '@/utils/check-image';
import { shortenList } from '@/utils/shorten-list';

export const ffzgDriver: Driver = async ({ debug = false, callbacks }) => {
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

	const programsList: { [externalLink: string]: Program } = {};
	const subjectsList: { [externalLink: string]: Subject } = {};
	const professorsList: { [externalLink: string]: Professor } = {};

	let counter = 0;

	// -----------------------------

	const scrapeCurrentPageForPrograms = async () => {
		(
			await page.evaluate((baseUrl) => {
				const programGroupHeadings = document.querySelectorAll(
					'.table .col-xs-6 h4'
				);
				const programGroups = document.querySelectorAll('.table .col-xs-6 ol');

				const results: Program[] = [];

				programGroups.forEach((programGroup, index) => {
					const heading = window.sanitizeTitle(
						programGroupHeadings[index].textContent
					);

					programGroup.querySelectorAll('a').forEach((program) => {
						const name = window.sanitizeTitle(program.textContent);

						const link = baseUrl + program.getAttribute('href') || '';

						results.push({
							name,
							externalLink: link,
							shortName: window.slugify(name),
							departments: [],
							subjects: [],
							type: heading
						});
					});
				});

				return results;
			}, baseUrl)
		).map((program) => {
			programsList[program.externalLink] = program;
		});
	};

	// Undergraduate programs
	await page.goto(urlProgramsUndergraduate);
	await hydrateWindowWithUtilFunctions(page);
	await scrapeCurrentPageForPrograms();

	// Integrated programs
	await page.goto(urlProgramsIntegrated);
	await hydrateWindowWithUtilFunctions(page);
	await scrapeCurrentPageForPrograms();

	// Graduate programs
	await page.goto(urlProgramsGraduate);
	await hydrateWindowWithUtilFunctions(page);
	await scrapeCurrentPageForPrograms();

	// -----------------------------
	// Visit each program link for subjects and professors

	counter = 0;

	for await (const programLink of shortenList(Object.keys(programsList), {
		enabled: debug,
		maxLength: 2
	})) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 2 : Object.keys(programsList).length,
			'Getting subjects from programs'
		);

		await page.goto(programLink);
		await hydrateWindowWithUtilFunctions(page);

		const result = await page.evaluate((baseUrl) => {
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

		result.professors.forEach((professor) => {
			professorsList[professor.externalLink] = professor;
		});

		result.subjects.forEach((subject) => {
			subjectsList[subject.externalLink] = subject;
		});

		result.programSubjects.forEach((programSubject) => {
			programsList[programLink].subjects.push(programSubject);
		});
	}

	// -----------------------------
	// Go through subjects from results and link professors

	counter = 0;

	for await (const subjectLink of shortenList(Object.keys(subjectsList), {
		enabled: debug,
		maxLength: 3
	})) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 3 : Object.keys(subjectsList).length,
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
			const subject = subjectsList[subjectLink];

			if (subject.professorsLinks.find((p) => p.link === link)) {
				subject.professorsLinks.find((p) => p.link === link)!.role = title;
			}
		});
	}

	// -----------------------------
	// Go through professors from results and assign images

	counter = 0;

	for await (const professorLink of shortenList(Object.keys(professorsList), {
		enabled: debug,
		maxLength: 5
	})) {
		counter += 1;
		callbacks?.onProgress?.(
			counter,
			debug ? 5 : Object.keys(professorsList).length,
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

		professorsList[professorLink].imageUrl =
			imgUrl && (await checkImage(imgUrl)) ? imgUrl : null;
	}

	// -----------------------------
	// Close browser

	if (!debug) {
		await browser.close();
	}

	return {
		programs: Object.values(programsList),
		professors: Object.values(professorsList),
		subjects: Object.values(subjectsList)
	};
};
