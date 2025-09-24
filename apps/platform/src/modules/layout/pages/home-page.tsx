import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { Container } from '@/global/components/container';
import { ContentPadding } from '@/global/layouts/content-padding';
import { FeedPostsLoader } from '@/modules/discussion/post/components/feed/feed-posts-loader';
import { HeroLogo } from '@/modules/landing-page/components/hero-logo';
import { Scribbles } from '@/modules/landing-page/components/scribbles';
import { CollegeGrid } from '@/modules/topic/college/components/college-grid';
import { GeneralTopicsGrid } from '@/modules/topic/general-topic/components/general-topics-grid';

export const HomePage = async () => {
	const { colleges } = await api.topic.college.listAll();
	const { generalTopics } = await api.topic.general.listAll();

	const isSignedIn = await api.user.me();

	return (
		<>
			<div className="flex flex-col items-center relative self-stretch pb-20 z-0 m-2 rounded-xl border border-accent-medium">
				<div className="max-w-[480px] px-10 mx-auto mb-4">
					<HeroLogo />
				</div>

				<Container>
					<GeneralTopicsGrid generalTopics={generalTopics} />
					<CollegeGrid colleges={colleges} />
				</Container>

				<Scribbles className="-z-10" />
			</div>

			<Container>
				<ContentPadding size="sm">
					{isSignedIn && <FeedPostsLoader />}
				</ContentPadding>

				<CacheHelper />
			</Container>
		</>
	);
};
