import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { SubjectDocumentsTablePaginated } from '@/modules/file/components/subject-documents-table-paginated';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}
export const SubjectMaterialsPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.topic.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<SubjectDocumentsTablePaginated subjectId={subject.topic.id} />
		</ContentPadding>
	);
};
