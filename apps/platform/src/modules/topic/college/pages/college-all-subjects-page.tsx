import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { CollegeSubjectsTablePaginated } from '../../subject/components/college-subjects-table-paginated';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeAllSubjectsPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.topic.college.getBySlug({
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<CollegeSubjectsTablePaginated collegeId={college.topic.id} />
		</ContentPadding>
	);
};
