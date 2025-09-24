import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import Link from 'next/link';

export const BookmarksContent = () => {
	const collegesQuery = api.topic.college.listAll.useQuery();

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full px-2 py-6 border-b border-background">
				<Link href="/">
					<Button
						variant="ghost-weak"
						size="sm"
						className="w-full justify-start px-2"
					>
						<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak shrink-0">
							<Icon icon="home" size={12} />
						</div>
						<span className="truncate">Početna</span>
					</Button>
				</Link>

				<Link href="/">
					<Button
						variant="ghost-weak"
						size="sm"
						className="w-full justify-start px-2"
					>
						<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak shrink-0">
							<Icon icon="layout-mosaic" size={12} />
						</div>
						<span className="truncate">Otkrij</span>
					</Button>
				</Link>
			</div>

			<div className="flex flex-col w-full px-2 py-6 border-b border-background">
				<div className="px-2 mb-3">
					<p className="caption text-neutral">Fakulteti</p>
				</div>

				{collegesQuery.data?.colleges.map((college) => (
					<Link href={`/${college.topic.slug}`} key={college.topic.id}>
						<Button
							variant="ghost-weak"
							size="sm"
							className="w-full justify-start px-2"
						>
							<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak shrink-0">
								<Icon icon="book-open" size={12} />
							</div>
							<span className="truncate">{college.topic.name}</span>
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
};
