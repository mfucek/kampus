import { api } from '@/deps/trpc/server';
import { MassUploader } from '../../../mass-uploader/components/mass-uploader';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
		programSlug: string;
	}>;
}

export const ProgramMassUploadPage = async ({ params }: PageProps) => {
	const { collegeSlug, programSlug } = await params;

	const program = await api.topic.program.getBySlug({
		collegeSlug,
		programSlug
	});

	if (!program) return null;

	const allSubjects = await api.topic.subject.listByProgramId({
		programId: program.topic.id
	});

	return <MassUploader subjects={allSubjects.subjects} />;
};
