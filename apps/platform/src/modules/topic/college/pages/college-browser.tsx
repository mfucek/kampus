import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { Container } from '@/global/components/container';
import { CollegeGrid } from '../components/college-grid';

export const CollegeBrowserPage = async () => {
	const colleges = await api.college.listAll();

	return (
		<Container>
			<CollegeGrid colleges={colleges} />
			<CacheHelper />
		</Container>
	);
};
