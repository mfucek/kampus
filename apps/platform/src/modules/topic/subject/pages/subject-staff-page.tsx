import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { SubjectStaffList } from '../components/subject-staff-list';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}
export const SubjectStaffPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.topic.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	const { staffs } = await api.topic.staff.listBySubjectId({
		subjectId: subject.topic.id
	});

	return (
		<div className="flex flex-col gap-10">
			<SubjectStaffList staffs={staffs} />
			<CacheHelper />
		</div>
	);
};
