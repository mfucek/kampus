import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { CollegeStaffsTablePaginated } from '@/modules/topic/staff/components/college-staffs-table-paginated';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeAllStaffPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.topic.college.getBySlug({
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-2">
				<CollegeStaffsTablePaginated collegeId={college.topic.id} />
			</div>
		</ContentPadding>
	);
};
