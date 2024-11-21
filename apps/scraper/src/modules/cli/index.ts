import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';

import type { Driver } from '@/modules/driver/types';
import { write } from '@/utils/write';

import { ferDriver } from '@/modules/driver/fer';
import { ffzgDriver } from '@/modules/driver/ffzg';
import chalk from 'chalk';
import { formatDistance } from 'date-fns';

const collegeList: Record<string, { label: string; driver: Driver }> = {
	fer: {
		label: 'FER',
		driver: ferDriver
	},
	ffzg: {
		label: 'FFZG',
		driver: ffzgDriver
	}
};

process.on('SIGINT', () => {
	console.log('\nReceived SIGINT. Exiting gracefully.');
	process.exit(0);
});

export const cli = async () => {
	// Check CLI arguments for flags and skip prompts
	const args = process.argv.slice(2);

	const argIsDebug = args.includes('--debug');

	const argCollege = args
		.find((arg) => arg.startsWith('--college='))
		?.split('=')[1];

	if (argCollege) {
		if (!Object.keys(collegeList).includes(argCollege)) {
			p.log.error(`Invalid college: ${argCollege}`);
			process.exit(1);
		}
	}

	// List out colleges available for scraping
	const argList = args.find((arg) => arg.startsWith('--list'));
	if (argList) {
		p.log.info(
			`Colleges available for scraping: ${Object.keys(collegeList).join(', ')}`
		);
		process.exit(0);
	}

	// -----------------------------
	// clear terminal
	if (!argIsDebug) {
		console.clear();
	}

	p.intro('Kampus.hr - Topic Scraper');

	// -----------------------------

	const colleges = argCollege
		? [argCollege]
		: ((await p.multiselect({
				message: 'Select colleges',
				options: Object.keys(collegeList).map((key) => ({
					label: collegeList[key as keyof typeof collegeList].label,
					value: key
				}))
		  })) as string[]);

	const isFullScrape = argIsDebug
		? false
		: ((await p.confirm({
				message: 'Full scrape',
				initialValue: false
		  })) as boolean);

	// -----------------------------

	for (const college of colleges) {
		const key = college;
		const label = collegeList[college].label;
		const driver = collegeList[college].driver;

		// Initialize spinner
		const spinner = p.spinner();
		spinner.start();

		const outDir = path.join(
			process.cwd(),
			'out',
			key + (!isFullScrape ? '-debug' : '')
		);

		// Make sure the output directory exists
		fs.mkdirSync(outDir, { recursive: true });

		let spinnerStartTime = Date.now();
		const startTime = Date.now();

		const result = await driver({
			debug: !isFullScrape,
			callbacks: {
				onProgress: (progress, total, title) => {
					if (progress === 1 || progress === 0) {
						spinnerStartTime = Date.now();
					}

					const elapsedTime = Date.now() - spinnerStartTime;
					const estimatedTime = elapsedTime * (total / progress);
					const remainingTime = estimatedTime - elapsedTime;

					const remainingText = `${formatDistance(0, remainingTime, {
						includeSeconds: true
					})} remaining`;

					spinner.message(
						`${title && chalk.blue(title + ' ')}${
							progress + ' / ' + total
						} ${chalk.gray(remainingText)} `
					);
				}
			}
		});

		spinner.stop(`Done scraping ${label}.`);

		// Log results to files
		p.log.success(`Total subjects: ${chalk.yellow(result.subjects.length)}`);
		write(`${outDir}/subjects.json`, result.subjects);

		p.log.success(`Total programs: ${chalk.yellow(result.programs.length)}`);
		write(`${outDir}/programs.json`, result.programs);

		p.log.success(
			`Total professors: ${chalk.yellow(result.professors.length)}`
		);
		write(`${outDir}/professors.json`, result.professors);

		p.note(
			`Output directory: ${outDir}\n\nTook ${formatDistance(
				0,
				Date.now() - startTime,
				{
					includeSeconds: true
				}
			)}`,
			`${label} scraped successfully!`
		);
	}

	p.outro('Done!');

	// Leave the browser open if it's a test run
	if (isFullScrape) {
		process.exit(0);
	}
};
