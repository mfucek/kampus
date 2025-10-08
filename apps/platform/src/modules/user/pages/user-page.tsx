import { api } from '@/deps/trpc/server';
import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { AuthorFeedPostsLoader } from '@/modules/discussion/post/components/feed/author-feed-posts-loader';
import { type ListUsersItem } from '../api/procedures/list';
import { UsersSection } from '../components/sections/manage-users';
import { RuleProtected } from '../permissions/components/protected';

interface PageProps {
	params: Promise<{
		userId: string;
	}>;
}

export const UserPage = async ({ params }: PageProps) => {
	const { userId } = await params;
	const me = await api.user.me();

	const user = await api.user.getById({ userId });

	let admin_user: ListUsersItem | null = null;
	if (me?.role === 'ADMINISTRATOR') {
		admin_user = (await api.user.admin.getById({ userId })).user;
	}

	return (
		<Container className="flex flex-col gap-10 pt-6 md:pt-10 pb-20">
			<PageHeader
				title={user.user.name ?? 'Korisnik'}
				tags={['Korisnik']}
				imageSrc={user.user.imageUrl ?? undefined}
			/>

			<RuleProtected rule="CAN_MANAGE_USERS">
				{admin_user && <UsersSection user={admin_user} />}
			</RuleProtected>

			<AuthorFeedPostsLoader authorId={userId} />
		</Container>
	);
};
