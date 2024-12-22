import { ContentPadding } from '@/global/layouts/content-padding';
import { StaffsTableAdvanced } from '@/modules/topic/staff/components/staffs-table-advanced';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeAllStaffPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-2">
				<StaffsTableAdvanced scope={{ collegeSlug }} />
			</div>
		</ContentPadding>
	);
};
