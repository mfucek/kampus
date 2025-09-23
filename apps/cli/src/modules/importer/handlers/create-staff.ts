import * as p from '@clack/prompts';

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
	const existingStaffs = await db.staff.findMany({
		where: {
			collegeId: collegeId
		},
		include: {
			Topic: true
		}
	});

	p.log.info(`Existing professors: ${existingStaffs.length}`);

	const spinnerProfs = new Spinner('Creating professors');

	const existingStaffSlugs = new Set(existingStaffs.map((p) => p.Topic.slug));
	const existingStaffExternalLinks = new Set(
		existingStaffs.map((p) => p.staffExternalLink).filter(Boolean) as string[]
	);

	const staffsToCreate = professorsData.filter(
		(p) =>
			!existingStaffExternalLinks.has(p.externalLink) &&
			!existingStaffSlugs.has(slugify(p.name))
	);

	let createdProfessors = 0;

	const BATCH_SIZE_STAFFS = 25;

	for (let i = 0; i < staffsToCreate.length; i += BATCH_SIZE_STAFFS) {
		const staffsToCreateChunk = staffsToCreate.slice(i, i + BATCH_SIZE_STAFFS);

		await db.$transaction(
			async (tx) => {
				await Promise.all(
					staffsToCreateChunk.map(async (staffToCreate) => {
						try {
							// first create the topic
							const newTopic = await tx.topic.create({
								data: {
									type: 'STAFF',
									slug: slugify(staffToCreate.name),
									name: staffToCreate.name,
									shortName: slugify(staffToCreate.name),
									externalImageUrl: staffToCreate.imageUrl
								}
							});

							// then create the staff
							await tx.staff.create({
								data: {
									topicId: newTopic.id,
									collegeId: collegeId,
									staffExternalLink: staffToCreate.externalLink
								}
							});
						} catch (error) {
							console.error(staffToCreate.name, error);
							throw error;
						}

						createdProfessors += 1;
					})
				);

				spinnerProfs.onProgress(i, staffsToCreate.length, 'Creating staff');
			},
			{
				timeout: 30000
			}
		);
	}

	spinnerProfs.stop(`Created ${createdProfessors} new staff.`);
};
