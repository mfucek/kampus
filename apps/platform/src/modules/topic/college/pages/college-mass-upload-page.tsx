import { api } from '@/deps/trpc/server';
import { MassUploader } from '../../../mass-uploader/components/college-mass-uploader';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeMassUploadPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.topic.college.getBySlug({
		collegeSlug
	});

	if (!college) return null;

	const allSubjects = await api.topic.subject.list({
		scope: {
			collegeId: college.id
		}
	});

	return (
		<MassUploader collegeId={college.id} subjects={allSubjects.subjects} />
	);
};
