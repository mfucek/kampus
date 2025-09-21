import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { Container } from '@/global/components/container';
import { CollegeGrid } from '@/modules/topic/college/components/college-grid';
import { GeneralTopicsGrid } from '@/modules/topic/general-topic/components/general-topics-grid';

export const HomePage = async () => {
	const { colleges } = await api.topic.college.listAll();
	const { generalTopics } = await api.topic.general.listAll();

	return (
		<Container>
			<GeneralTopicsGrid generalTopics={generalTopics} />
			<CollegeGrid colleges={colleges} />
			<CacheHelper />
		</Container>
	);
};
