import { api } from '@/lib/trpc/server';
import { StaffsTableAdvanced } from '@/modules/staff/components/staffs-table-advanced';

interface PageProps {
	params: {
		subjectSlug: string;
		collegeSlug: string;
	};
}
export const SubjectStaffPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10 px-4 lg:px-0">
			<StaffsTableAdvanced scope={{ subjectId: subject.id }} />
		</div>
	);
};
