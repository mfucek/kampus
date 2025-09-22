import { api } from '@/deps/trpc/server';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Composer } from '@/modules/composer/components';
import { TopLevelPostsLoader } from '@/modules/discussion/post/components/top-level-post/top-level-posts-loader';

interface PageProps {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}

export const SubjectDiscussionPage = async ({ params }: PageProps) => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await api.topic.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<ContentPadding size="sm">
			<div className="flex flex-col gap-10">
				<Composer topicId={subject.topic.id} />
				<TopLevelPostsLoader topicId={subject.topic.id} />
			</div>
		</ContentPadding>
	);
};
