import { ContentPadding } from '@/global/layouts/content-padding';
import { api } from '@/lib/trpc/server';
import { DocumentsTableAdvanced } from '@/modules/file/components/documents-table-advanced';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}
export const SubjectMaterialsPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<DocumentsTableAdvanced scope={{ topicId: subject.id }} />
		</ContentPadding>
	);
};
