import { api } from '@/lib/trpc/server';
import { CollegeMassUploader } from '../components/college-mass-uploader';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeMassUploadPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	if (!college) return null;

	return <CollegeMassUploader collegeId={college.id} />;
};
