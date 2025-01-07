import { Badge } from '@/lib/shadcn/ui/badge';
import Image from 'next/image';
import { ContentPadding } from '../layouts/content-padding';

export const PageHeader = async ({
	title,
	tags = [],
	imageSrc
}: {
	title: string;
	tags?: string[];
	imageSrc?: string;
}) => {
	return (
		<ContentPadding size="lg">
			<div className="flex flex-row items-center gap-4 md:gap-6">
				{imageSrc && (
					<div className="w-[72px] h-[96px] md:w-[120px] md:h-[160px] bg-section md:bg-neutral-weak rounded-xl overflow-hidden">
						<Image src={imageSrc} alt={title} fill className="object-cover" />
					</div>
				)}
				<div className="flex flex-col flex-1 gap-2">
					<div className="flex flex-wrap">
						{tags.map((tag) => (
							<Badge key={tag} variant="tertiary" theme="neutral">
								{tag}
							</Badge>
						))}
					</div>
					<div className="display-3">{title}</div>
				</div>
			</div>
		</ContentPadding>
	);
};

export const PageHeaderSkeleton = () => {
	return (
		<ContentPadding size="lg">
			<div className="flex flex-row gap-2">
				<div className="flex flex-col gap-2">
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
				<div className="w-20 h-40 bg-red-500">asd</div>
			</div>
		</ContentPadding>
	);
};
