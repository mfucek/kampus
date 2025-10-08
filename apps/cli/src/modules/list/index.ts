import * as p from '@clack/prompts';

import { drivers } from '../scraper/drivers/drivers';

/** List out colleges available for scraping */
export const lister = async () => {
	p.log.info(
		`Colleges available for scraping: ${Object.keys(drivers).join(', ')}`
	);

	p.outro('Done!');

	process.exit(0);
};
