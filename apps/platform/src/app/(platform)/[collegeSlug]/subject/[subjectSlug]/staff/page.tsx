import { db } from '@/lib/prisma/db';
import { SubjectStaffPage } from '@/modules/topic/subject/pages/subject-staff-page';

export default SubjectStaffPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const subjects = await db.topic.findMany({
		where: {
			type: 'SUBJECT',
			Subject: {
				isNot: null
			}
		},
		select: {
			College: {
				select: {
					slug: true
				}
			},
			slug: true
		}
	});

	const slugs = subjects.map((subject) => ({
		collegeSlug: subject.College.slug,
		subjectSlug: subject.slug
	}));

	return slugs;
};
