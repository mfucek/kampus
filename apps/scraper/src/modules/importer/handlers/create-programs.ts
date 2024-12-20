import * as p from '@clack/prompts';

import { type Topic } from '@prisma/client';

import { Spinner } from '@/lib/clack/spinner';
import { db } from '@/lib/prisma/db';
import { type Program } from '@/types';
import { slugify } from '@/utils/slugify';

interface CreateProgramsOptions {
	collegeId: string;
	programsData: Program[];
}

const BATCH_SIZE_PROGRAMS = 10;

export const createPrograms = async ({
	collegeId,
	programsData
}: CreateProgramsOptions) => {
	// ------------------
	// Create programs

	const existingPrograms = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'PROGRAM',
			Program: {
				isNot: null
			}
		},
		include: {
			Program: true
		}
	});

	p.log.info(`Existing programs: ${existingPrograms.length}`);

	const spinnerPrograms = new Spinner('Creating programs');

	const existingProgramSlugs = new Set(existingPrograms.map((p) => p.slug));
	const existingProgramExternalLinks = new Set(
		existingPrograms
			.map((p) => p.Program!.programExternalLink)
			.filter(Boolean) as string[]
	);

	const programsToCreate = programsData.filter(
		(p) =>
			!existingProgramExternalLinks.has(p.externalLink) &&
			!existingProgramSlugs.has(slugify(p.name))
	);

	let createdPrograms = 0;

	for (let i = 0; i < programsToCreate.length; i += BATCH_SIZE_PROGRAMS) {
		const chunk = programsToCreate.slice(i, i + BATCH_SIZE_PROGRAMS);

		await db.$transaction(
			async (tx) => {
				for (const program of chunk) {
					let topic: Topic | null = null;
					const wantedSlug = slugify(program.name);
					let suffix = 0;

					while (topic) {
						topic = await tx.topic.findFirst({
							where: {
								type: 'PROGRAM',
								collegeId: collegeId,
								slug: wantedSlug + (suffix ? `-${suffix}` : '')
							}
						});

						if (topic) {
							suffix = suffix + 1;
						}
					}

					const newTopic = await tx.topic.create({
						data: {
							type: 'PROGRAM',
							slug: wantedSlug + (suffix ? `-${suffix}` : ''),
							name: program.name,
							collegeId: collegeId,
							shortName: program.shortName
						}
					});

					try {
						await tx.program.create({
							data: {
								topicId: newTopic.id,
								departments: program.departments,
								programExternalLink: program.externalLink,
								type: program.type
							}
						});
					} catch (error) {
						console.log('ERRORR!!!!', newTopic.id, program.externalLink);
						throw error;
					}

					createdPrograms += 1;
				}

				spinnerPrograms.onProgress(
					i,
					programsToCreate.length,
					'Creating programs'
				);
			},
			{
				timeout: 30000
			}
		);
	}

	spinnerPrograms.stop(`Created ${createdPrograms} new programs.`);
};
