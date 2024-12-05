import * as p from '@clack/prompts';

import { Spinner } from '@/lib/clack/spinner';
import { db } from '@/lib/prisma/db';
import { type Subject } from '@/types';

interface LinkSubjectStaffOptions {
	collegeId: string;
	subjectsData: Subject[];
}

const BATCH_SIZE_SUBJECT_STAFF = 75;

export const linkSubjectStaff = async ({
	collegeId,
	subjectsData
}: LinkSubjectStaffOptions) => {
	const subjectProfessorsCount = subjectsData.flatMap(
		(s) => s.professorsLinks
	).length;

	// ------------------
	// Remove existing subject-staff relationships in this college

	const removedSubjectStaffRelationships = await db.subjectStaff.deleteMany({
		where: {
			Subject: {
				Topic: {
					collegeId: collegeId
				}
			}
		}
	});

	p.log.info(
		`Removed ${removedSubjectStaffRelationships.count} existing subject-staff relationships in this college.`
	);

	// ------------------
	// Add subject-staff relationships

	const spinnerSubjectStaff = new Spinner(
		'Creating subject-staff relationships'
	);

	let createdSubjectStaffRelationships = 0;

	// [subjectLink, staffLink, role]
	const subjectStaffToCreate = subjectsData.flatMap((s) =>
		s.professorsLinks.map(
			({ link, role }) => [s.externalLink, link, role] as const
		)
	);

	// ------------------
	// Cache subject links

	// link -> id
	const subjectCache = new Map<string, string>();
	const dbSubjects = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'SUBJECT',
			Subject: {
				subjectExternalLink: {
					not: null
				}
			}
		},
		select: {
			id: true,
			Subject: { select: { subjectExternalLink: true } }
		}
	});
	for (const s of dbSubjects) {
		subjectCache.set(s.Subject!.subjectExternalLink!, s.id);
	}

	// link -> id
	const staffCache = new Map<string, string>();
	const dbStaff = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'STAFF',
			Staff: {
				staffExternalLink: {
					not: null
				}
			}
		},
		select: {
			id: true,
			Staff: { select: { staffExternalLink: true } }
		}
	});
	for (const s of dbStaff) {
		staffCache.set(s.Staff!.staffExternalLink!, s.id);
	}

	// ------------------

	for (
		let i = 0;
		i < subjectStaffToCreate.length;
		i += BATCH_SIZE_SUBJECT_STAFF
	) {
		const chunk = subjectStaffToCreate.slice(i, i + BATCH_SIZE_SUBJECT_STAFF);

		await db.$transaction(async (tx) => {
			for (const [subjectLink, staffLink, role] of chunk) {
				const subjectId = subjectCache.get(subjectLink);
				const staffId = staffCache.get(staffLink);

				if (!subjectId || !staffId) {
					console.log(
						`Subject or staff not found: ${subjectLink} ${staffLink}`
					);
					continue;
				}

				await tx.subjectStaff.create({
					data: {
						subjectId: subjectId,
						staffId: staffId,
						staffRole: role
					}
				});
			}
		});

		createdSubjectStaffRelationships += chunk.length;
		spinnerSubjectStaff.onProgress(
			createdSubjectStaffRelationships,
			subjectProfessorsCount,
			'subject-staff'
		);
	}

	spinnerSubjectStaff.stop(
		`Created ${createdSubjectStaffRelationships} new subject-staff relationships.`
	);
};

// @TODO: add updating of existing staff records with new imageUrl
