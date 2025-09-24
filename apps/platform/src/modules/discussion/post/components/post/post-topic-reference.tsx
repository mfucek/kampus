import { type FC } from 'react';

import { Badge } from '@/lib/shadcn/ui/badge';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';

export const PostTopicReference: FC<{ topicName: string }> = ({
	topicName
}) => {
	return (
		<Badge variant="secondary" theme="neutral" size="md" className="w-fit">
			{topicName}
		</Badge>
	);
};

export const PostTopicReferenceSkeleton = () => {
	return <Skeleton className="w-20 h-5 rounded-full" />;
};
