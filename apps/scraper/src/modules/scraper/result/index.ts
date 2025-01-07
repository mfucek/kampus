import type { DriverCallbacks, Professor, Program, Subject } from '@/types';
import type { Logger } from '@/utils/logger';

export class ScraperResult {
	programsList: { [externalLink: string]: Program };
	subjectsList: { [externalLink: string]: Subject };
	professorsList: { [externalLink: string]: Professor };
	logger: Logger | undefined;
	callbacks: DriverCallbacks | undefined;

	constructor(
		logger: Logger | undefined,
		callbacks: DriverCallbacks | undefined
	) {
		this.programsList = {};
		this.subjectsList = {};
		this.professorsList = {};

		this.logger = logger;
		this.callbacks = callbacks;
		this.logger?.log('info', 'Initializing lists');
	}

	getPayload() {
		return {
			programs: Object.values(this.programsList),
			professors: Object.values(this.professorsList),
			subjects: Object.values(this.subjectsList)
		};
	}
}
