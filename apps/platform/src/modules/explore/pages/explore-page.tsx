import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { ContentPadding } from '@/global/layouts/content-padding';
import { CollegeGrid } from '@/modules/topic/college/components/college-grid';
import { GeneralTopicsGrid } from '@/modules/topic/general-topic/components/general-topics-grid';

export const ExplorePage = async () => {
	const { generalTopics } = await api.topic.general.listAll();
	const { colleges } = await api.topic.college.listAll();

	return (
		<Container className="flex flex-col gap-10 pt-6 md:pt-10 pb-20">
			<ContentPadding size="lg">
				<PageHeader title="Otkrij" description="Pronađi što te zanima" />
			</ContentPadding>

			<div className="flex flex-col gap-6">
				<ContentPadding size="lg">
					<div className="flex flex-row">
						<p className="title-1 text-neutral">Općenite teme</p>
					</div>
				</ContentPadding>

				<GeneralTopicsGrid generalTopics={generalTopics} />
			</div>

			<div className="flex flex-col gap-6">
				<ContentPadding size="lg">
					<div className="flex flex-row">
						<p className="title-1 text-neutral">Stranice fakulteta</p>
					</div>
				</ContentPadding>

				<CollegeGrid colleges={colleges} />
			</div>
		</Container>
	);
};
