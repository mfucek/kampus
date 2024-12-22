import { ContentPadding } from '@/global/layouts/content-padding';
import { api } from '@/lib/trpc/server';
import { SubjectsTableAdvanced } from '@/modules/topic/subject/components/subjects-table-advanced';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeAllSubjectsPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<SubjectsTableAdvanced scope={{ collegeId: college.id }} />
		</ContentPadding>
	);
};
