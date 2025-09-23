import * as p from '@clack/prompts';
import { Prisma } from '@prisma/client';

import { Spinner } from '@/deps/clack/spinner';
import { db } from '@/deps/prisma/db';
import { type Professor } from '@/types';
import { slugify } from '@/utils/slugify';

interface ImportStaffOptions {
	collegeId: string;
	professorsData: Professor[];
}

export const createStaff = async ({
	collegeId,
	professorsData
}: ImportStaffOptions) => {
	const existingProfessors = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'STAFF',
			Staff: {
				isNot: null
			}
		},
		include: {
			Staff: true
		}
	});

	p.log.info(`Existing professors: ${existingProfessors.length}`);

	const spinnerProfs = new Spinner('Creating professors');

	const existingProfessorSlugs = new Set(existingProfessors.map((p) => p.slug));
	const existingProfessorExternalLinks = new Set(
		existingProfessors
			.map((p) => p.Staff!.staffExternalLink)
			.filter(Boolean) as string[]
	);

	const professorsToCreate = professorsData.filter(
		(p) =>
			!existingProfessorExternalLinks.has(p.externalLink) &&
			!existingProfessorSlugs.has(slugify(p.name))
	);

	let createdProfessors = 0;

	const BATCH_SIZE_PROFESSORS = 25;

	for (let i = 0; i < professorsToCreate.length; i += BATCH_SIZE_PROFESSORS) {
		const chunk = professorsToCreate.slice(i, i + BATCH_SIZE_PROFESSORS);

		await db.$transaction(
			async (tx) => {
				// First create the topics
				const topicsToCreate: Prisma.TopicCreateManyInput[] = chunk.map(
					(p) => ({
						type: 'STAFF',
						slug: slugify(p.name),
						name: p.name,
						collegeId: collegeId,
						shortName: slugify(p.name)
					})
				);

				await tx.topic.createMany({
					data: topicsToCreate,
					skipDuplicates: true
				});

				// Connect staff to topics
				for (const professor of chunk) {
					const topic = await tx.topic.findFirst({
						where: {
							type: 'STAFF',
							collegeId: collegeId,
							slug: slugify(professor.name)
						}
					});

					if (topic) {
						try {
							await tx.staff.create({
								data: {
									topicId: topic.id,
									imageUrl: professor.imageUrl,
									staffExternalLink: professor.externalLink
								}
							});
						} catch (error) {
							console.log(topic.id, professor.externalLink);
							throw error;
						}
					}

					createdProfessors += 1;
				}

				spinnerProfs.onProgress(i, professorsToCreate.length, 'Creating staff');
			},
			{
				timeout: 30000
			}
		);
	}

	spinnerProfs.stop(`Created ${createdProfessors} new staff.`);
};
