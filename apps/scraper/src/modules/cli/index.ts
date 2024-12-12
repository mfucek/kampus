import * as p from '@clack/prompts';

import { drivers } from '@/modules/scraper/drivers/drivers';
import { importer } from '../importer';
import { lister } from '../list';
import { scraper } from '../scraper';

process.on('SIGINT', () => {
	console.log('\nReceived SIGINT. Exiting gracefully.');
	process.exit(0);
});

// Check CLI arguments for flags and skip prompts
const args = process.argv.slice(2);

const handleList = async () => {
	await lister();
	process.exit(0);
};

const handleImport = async () => {
	// ------------------
	// Target environment

	const argProduction = args.includes('--production');
	const argStaging = args.includes('--staging');

	const targetEnvironment = argProduction
		? 'production'
		: argStaging
		? 'staging'
		: ((await p.select({
				message: 'Target environment',
				options: [
					{ label: 'Production', value: 'production' },
					{ label: 'Staging', value: 'staging' }
				]
		  })) as 'production' | 'staging');

	// ------------------
	// College slug

	const argCollegeSlug = args
		.find((arg) => arg.startsWith('--college='))
		?.split('=')[1];

	const collegeSlug =
		argCollegeSlug ??
		((await p.text({
			message: 'College slug',
			initialValue: 'fer'
		})) as string);

	// ------------------
	// Input directory

	const argInputDir = args
		.find((arg) => arg.startsWith('--input='))
		?.split('=')[1];

	const inputDir =
		argInputDir ??
		((await p.text({
			message: 'Input directory',
			initialValue: `out/${collegeSlug}`
		})) as string);

	// ------------------
	// Skipping

	const argSkipStaff = args.includes('--skip-staff');
	const argSkipSubjects = args.includes('--skip-subjects');
	const argSkipPrograms = args.includes('--skip-programs');

	// ------------------

	try {
		await importer({
			collegeSlug,
			inputDir,
			targetEnvironment,
			importStaff: !argSkipStaff,
			importSubjects: !argSkipSubjects,
			importPrograms: !argSkipPrograms
		});
	} catch (error) {
		p.log.error((error as Error).message);
		console.log('');
		process.exit(0);
	}
};

const handleScrape = async () => {
	// ------------------
	// College

	const argCollege = args
		.find((arg) => arg.startsWith('--college='))
		?.split('=')[1];
	if (argCollege && !Object.keys(drivers).includes(argCollege)) {
		p.log.error(`Invalid college: ${argCollege}`);
		process.exit(1);
	}

	const colleges = argCollege
		? [argCollege]
		: ((await p.multiselect({
				message: 'Select colleges',
				options: Object.keys(drivers).map((key) => ({
					label: drivers[key as keyof typeof drivers].label,
					value: key
				}))
		  })) as string[]);

	// ------------------
	// Full scrape / Limited scrape

	const argIsLimited = args.includes('--limited');
	const argIsFull = args.includes('--full');

	const fullScrape = argIsLimited
		? false
		: argIsFull
		? true
		: ((await p.confirm({
				message: 'Full scrape',
				initialValue: false
		  })) as boolean);

	// ------------------

	try {
		await scraper({
			colleges,
			fullScrape
		});
	} catch (error) {
		p.log.error((error as Error).message);
		console.log('');
		process.exit(0);
	}
};

export const cli = async () => {
	p.intro('Kampus.hr - Topic Scraper');

	// -----------------------------
	// Mode

	const argMode = ['scrape', 'list', 'import'].includes(args[0])
		? (args[0] as 'scrape' | 'list' | 'import')
		: null;

	const mode =
		argMode ??
		(await p.select({
			message: 'Mode',
			options: [
				{ label: 'Scrape', value: 'scrape' },
				{ label: 'List colleges', value: 'list' },
				{ label: 'Import', value: 'import' }
			]
		}));

	// -----------------------------
	// Handle mode

	if (mode === 'list') {
		await handleList();
	}

	if (mode === 'import') {
		await handleImport();
	}

	if (mode === 'scrape') {
		await handleScrape();
	}
};
