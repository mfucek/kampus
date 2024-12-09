import { api } from '@/lib/trpc/server';
import { DocumentsTableAdvanced } from '@/modules/file/components/documents-table-advanced';

interface PageProps {
	params: {
		subjectSlug: string;
		collegeSlug: string;
	};
}
export const SubjectMaterialsPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = params;

	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-10 px-4 lg:px-0">
			<DocumentsTableAdvanced scope={{ topicId: subject.id }} />
		</div>
	);
};
