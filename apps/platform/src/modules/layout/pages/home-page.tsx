import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { Container } from '@/global/components/container';
import { CollegeGrid } from '@/modules/topic/college/components/college-grid';

export const HomePage = async () => {
	const colleges = await api.college.listAll();

	return (
		<Container>
			<CollegeGrid colleges={colleges} />
			<CacheHelper />
		</Container>
	);
};
