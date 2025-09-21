import { db } from '@/deps/prisma';
import { SubjectStaffPage } from '@/modules/topic/subject/pages/subject-staff-page';

export default SubjectStaffPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const subjects = await db.subject.findMany({
		include: {
			Topic: true,
			College: {
				include: {
					Topic: true
				}
			}
		}
	});

	const slugs = subjects.map((subject) => ({
		collegeSlug: subject.College.Topic.slug,
		subjectSlug: subject.Topic.slug
	}));

	return slugs;
};
