import * as p from '@clack/prompts';

import { Prisma } from '@prisma/client';

import { Spinner } from '@/lib/clack/spinner';
import { db } from '@/lib/prisma/db';
import { type Program } from '@/types';
import { slugify } from '@/utils/slugify';

interface CreateProgramsOptions {
	collegeId: string;
	programsData: Program[];
}

const BATCH_SIZE_PROGRAMS = 25;

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

		await db.$transaction(async (tx) => {
			// First create the topics
			const topicsToCreate: Prisma.TopicCreateManyInput[] = chunk.map((p) => ({
				type: 'PROGRAM',
				slug: slugify(p.name),
				name: p.name,
				collegeId: collegeId,
				shortName: p.shortName
			}));

			await tx.topic.createMany({
				data: topicsToCreate,
				skipDuplicates: true
			});

			// Connect programs to topics
			for (const program of chunk) {
				const topic = await tx.topic.findFirst({
					where: {
						type: 'PROGRAM',
						collegeId: collegeId,
						slug: slugify(program.name)
					}
				});

				if (!topic) {
					console.log(`Topic not found: ${program.name}`);
					continue;
				}

				await tx.program.create({
					data: {
						topicId: topic.id,
						departments: program.departments,
						programExternalLink: program.externalLink
					}
				});
			}

			createdPrograms += chunk.length;
			spinnerPrograms.onProgress(
				createdPrograms,
				programsToCreate.length,
				'Creating programs'
			);
		});
	}

	spinnerPrograms.stop(`Created ${createdPrograms} new programs.`);
};
