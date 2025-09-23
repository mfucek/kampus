import { db } from '@/deps/prisma';
import { CollegeProgramsPage } from '@/modules/topic/college/pages/college-programs-page';

export default CollegeProgramsPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const collegeSlugs = (
		await db.college.findMany({
			include: {
				Topic: true
			}
		})
	).map((college) => ({
		collegeSlug: college.Topic.slug
	}));

	return collegeSlugs;
};
