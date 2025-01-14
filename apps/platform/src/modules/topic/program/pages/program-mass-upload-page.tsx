import { api } from '@/lib/trpc/server';
import { MassUploader } from '../../../mass-uploader/components/college-mass-uploader';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
		programSlug: string;
	}>;
}

export const ProgramMassUploadPage = async ({ params }: PageProps) => {
	const { collegeSlug, programSlug } = await params;

	const program = await api.program.getBySlug({
		collegeSlug,
		programSlug
	});

	if (!program) return null;

	const allSubjects = await api.subject.list({
		scope: {
			programId: program.id
		}
	});

	return (
		<MassUploader
			collegeId={program.collegeId}
			subjects={allSubjects.subjects}
		/>
	);
};
