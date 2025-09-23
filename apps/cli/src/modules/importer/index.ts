import { createPrismaClient } from '@/deps/prisma/db';

import { checkCollege } from './handlers/check-college';
import { createPrograms } from './handlers/create-programs';
import { createStaff } from './handlers/create-staff';
import { createSubjects } from './handlers/create-subjects';
import { linkProgramSubjects } from './handlers/link-program-subjects';
import { linkSubjectStaff } from './handlers/link-subject-staff';
import { loadData } from './handlers/load-data';

interface ImporterOptions {
	collegeSlug: string;
	inputDir: string;
	targetEnvironment: 'staging' | 'production';

	importStaff: boolean;
	importSubjects: boolean;
	importPrograms: boolean;
}

export const importer = async (options: ImporterOptions) => {
	const { collegeSlug, inputDir, targetEnvironment } = options;

	// ------------------
	// Initialize database connection

	const isProduction = targetEnvironment === 'production';
	createPrismaClient(isProduction ? 'production' : 'staging');

	// ------------------

	const collegeId = await checkCollege(collegeSlug);

	const { professorsData, subjectsData, programsData } = await loadData({
		collegeSlug,
		inputDir
	});

	if (options.importStaff) {
		await createStaff({ collegeId, professorsData });
	}

	if (options.importSubjects) {
		await createSubjects({ collegeId, subjectsData });
		await linkSubjectStaff({ collegeId, subjectsData });
	}

	if (options.importPrograms) {
		await createPrograms({ collegeId, programsData });
		await linkProgramSubjects({ collegeId, programsData });
	}
};
