import * as p from '@clack/prompts';

import { type Topic } from '@prisma/client';

import { Spinner } from '@/deps/clack/spinner';
import { db } from '@/deps/prisma/db';
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

	const existingPrograms = await db.program.findMany({
		where: {
			collegeId: collegeId
		},
		include: {
			Topic: true
		}
	});

	p.log.info(`Existing programs: ${existingPrograms.length}`);

	const spinnerPrograms = new Spinner('Creating programs');

	const existingProgramSlugs = new Set(
		existingPrograms.map((p) => p.Topic.slug)
	);
	const existingProgramExternalLinks = new Set(
		existingPrograms
			.map((p) => p.programExternalLink)
			.filter(Boolean) as string[]
	);

	const programsToCreate = programsData.filter(
		(p) =>
			!existingProgramExternalLinks.has(p.externalLink) &&
			!existingProgramSlugs.has(slugify(p.name))
	);

	let createdPrograms = 0;

	for (let i = 0; i < programsToCreate.length; i += BATCH_SIZE_PROGRAMS) {
		const programsToCreateChunk = programsToCreate.slice(
			i,
			i + BATCH_SIZE_PROGRAMS
		);

		await db.$transaction(
			async (tx) => {
				for (const programToCreate of programsToCreateChunk) {
					let topic: Topic | null = null;
					const wantedSlug = slugify(programToCreate.name);
					let suffix = 0;

					while (topic) {
						topic = await tx.topic.findFirst({
							where: {
								type: 'PROGRAM',
								slug: wantedSlug + (suffix ? `-${suffix}` : ''),
								Program: {
									collegeId: collegeId
								}
							}
						});

						if (topic) {
							suffix = suffix + 1;
						}
					}

					try {
						const newTopic = await tx.topic.create({
							data: {
								type: 'PROGRAM',
								slug: wantedSlug + (suffix ? `-${suffix}` : ''),
								name: programToCreate.name,
								shortName: programToCreate.shortName
							}
						});

						await tx.program.create({
							data: {
								topicId: newTopic.id,
								collegeId: collegeId,
								departments: programToCreate.departments,
								programExternalLink: programToCreate.externalLink,
								type: programToCreate.type
							}
						});
					} catch (error) {
						console.error(programToCreate.name, error);
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
