import { type FC } from 'react';

import { Badge } from '@/lib/shadcn/ui/badge';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';

export const PostReplyReference: FC<{ references: string[] }> = ({
	references
}) => {
	return (
		<Badge
			variant="secondary"
			theme="neutral"
			size="md"
			className="w-fit"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			{references.join(' → ')}
		</Badge>
	);
};

export const PostReplyReferenceSkeleton = () => {
	return <Skeleton className="w-20 h-5 rounded-full" />;
};
