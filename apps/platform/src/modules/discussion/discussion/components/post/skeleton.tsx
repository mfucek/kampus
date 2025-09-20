import { Skeleton } from '@/lib/shadcn/ui/skeleton';

const PostThreadingSkeleton = () => {
	return (
		<div className="flex flex-row gap-2">
			<Skeleton className="w-6 h-6 rounded-full" />
		</div>
	);
};

const PostBodyHeaderSkeleton = () => {
	return (
		<div className="flex flex-row h-6 items-center">
			<Skeleton className="w-20">
				<div className="flex flex-row gap-2 items-center">
					<span className="caption w-12">&nbsp;</span>
				</div>
			</Skeleton>
		</div>
	);
};

const PostActionsSkeleton = () => {
	return (
		<div className="h-6 flex flex-row gap-2">
			<Skeleton className="w-24 h-6 rounded-full" />
			<Skeleton className="w-16 h-6 rounded-full" />
			<Skeleton className="w-16 h-6 rounded-full" />
		</div>
	);
};

const PostBodySkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<PostBodyHeaderSkeleton />
			<Skeleton className="w-full h-6" />
			<Skeleton className="w-full h-6" />
			<PostActionsSkeleton />
		</div>
	);
};

export const PostSkeleton = () => {
	return (
		<div className="bg-section p-3 rounded-xl overflow-hidden">
			<div className="flex flex-row gap-2">
				<PostThreadingSkeleton />
				<PostBodySkeleton />
			</div>
		</div>
	);
};
