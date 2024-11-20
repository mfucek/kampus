import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';

import type { Driver } from '@/modules/driver/types';
import { write } from '@/utils/write';

import { ferDriver } from '@/modules/driver/fer';
import { ffzgDriver } from '@/modules/driver/ffzg';

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
	p.intro('Kampus.hr - Topic Scraper');

	const { colleges, isFullScrape } = await p.group(
		{
			colleges: () =>
				p.multiselect({
					message: 'Select colleges',
					options: Object.keys(collegeList).map((key) => ({
						label: collegeList[key as keyof typeof collegeList].label,
						value: key
					}))
				}),

			isFullScrape: () =>
				p.confirm({
					message: 'Full scrape',
					initialValue: false
				})
		},
		{
			onCancel: () => {
				p.outro('Exiting...');
				process.exit(0);
			}
		}
	);

	// -----------------------------

	for (const college of colleges) {
		const spinner = p.spinner();
		spinner.start();
		const label = collegeList[college].label;
		const driver = collegeList[college].driver;

		const outDir = path.join(
			process.cwd(),
			'out',
			label + (!isFullScrape ? '-debug' : '')
		);
		fs.mkdirSync(outDir, { recursive: true });

		const result = await driver({
			debug: !isFullScrape,
			callbacks: {
				onProgress: (progress, total, done) => {
					spinner.message(`${progress} / ${total} `);
					if (done) {
						spinner.stop(`Done scraping ${label}.`);
					}
				}
			}
		});

		p.log.success(`Total subjects: ${result.subjects.length}`);
		write(`${outDir}/subjects.json`, result.subjects);

		p.log.success(`Total programs: ${result.programs.length}`);
		write(`${outDir}/programs.json`, result.programs);

		p.log.success(`Total professors: ${result.professors.length}`);
		write(`${outDir}/professors.json`, result.professors);

		p.log.success(`${label} scraped successfully!`);
	}

	p.outro('Done!');

	if (isFullScrape) {
		process.exit(0);
	}
};
