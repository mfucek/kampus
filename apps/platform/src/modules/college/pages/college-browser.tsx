import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { CollegeGrid } from '../components/college-grid';

export const CollegeBrowserPage = async () => {
	const colleges = await api.college.listAll();

	return (
		<Container>
			<CollegeGrid colleges={colleges} />
		</Container>
	);
};
