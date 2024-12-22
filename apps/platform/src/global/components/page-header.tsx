import { Badge } from '@/lib/shadcn/ui/badge';
import { ContentPadding } from '../layouts/content-padding';

export const PageHeader = async ({
	title,
	tags = []
}: {
	title: string;
	tags?: string[];
}) => {
	return (
		<ContentPadding size="lg">
			<div className="flex flex-col gap-2">
				<div className="flex flex-wrap">
					{tags.map((tag) => (
						<Badge key={tag} variant="tertiary" theme="neutral">
							{tag}
						</Badge>
					))}
				</div>
				<div className="display-3">{title}</div>
			</div>
		</ContentPadding>
	);
};

export const PageHeaderSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				<Badge variant="tertiary" theme="neutral">
					<div className="w-20"></div>
				</Badge>
				<Badge variant="tertiary" theme="neutral">
					<div className="w-10"></div>
				</Badge>
			</div>
			<div className="w-40 h-[32px] rounded-md bg-neutral-medium" />
		</div>
	);
};
