import { CacheHelper } from '@/global/components/cache-helper';
import { api } from '@/lib/trpc/server';
import { SubjectStaffList } from '../components/subject-staff-list';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}
export const SubjectStaffPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	const staffs = await api.subject.listStaff({
		subjectId: subject.id
	});

	return (
		<div className="flex flex-col gap-10">
			<SubjectStaffList staffs={staffs} />
			<CacheHelper />
		</div>
	);
};
