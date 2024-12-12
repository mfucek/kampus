import { Badge } from '@/lib/shadcn/ui/badge';

export const PageHeader = async ({
	title,
	tags = []
}: {
	title: string;
	tags?: string[];
}) => {
	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<div className="flex flex-wrap">
				{tags.map((tag) => (
					<Badge key={tag} variant="tertiary" theme="neutral">
						{tag}
					</Badge>
				))}
			</div>
			<div className="display-3">{title}</div>
		</div>
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
