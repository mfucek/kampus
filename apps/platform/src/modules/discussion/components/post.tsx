import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { Icon } from '@/modules/global/components/icon';
import Image from 'next/image';

type Reaction = 'like' | 'dislike' | 'nothing';

const reactionToTheme = (reaction?: Reaction) => {
	switch (reaction) {
		case 'like':
			return 'success';
		case 'dislike':
			return 'danger';
		default:
			return 'neutral';
	}
};

const Reactions = ({
	reaction,
	count
}: {
	reaction?: Reaction;
	count: number;
}) => {
	return (
		<div
			className={cn(
				'flex flex-row gap-2 rounded-full items-center bg-neutral-weak',
				reaction == 'like' && 'bg-success-medium',
				reaction == 'dislike' && 'bg-danger-medium'
			)}
		>
			<Button
				theme={reactionToTheme(reaction)}
				variant={
					reaction == 'like' ? 'solid' : !reaction ? 'ghost' : 'ghost-weak'
				}
				className="px-2 w-auto"
				size="xs"
				iconOnly
				rounded
			>
				<Icon icon="like" size={18} />
			</Button>
			<span
				className={cn(
					'button-sm',
					!reaction &&
						(count < 0
							? 'text-danger'
							: count > 0
								? 'text-success'
								: 'text-neutral')
				)}
			>
				{count}
			</span>
			<Button
				theme={reactionToTheme(reaction)}
				variant={
					reaction == 'dislike' ? 'solid' : !reaction ? 'ghost' : 'ghost-weak'
				}
				className="px-2 w-auto"
				size="xs"
				iconOnly
				rounded
			>
				<Icon icon="dislike" size={18} />
			</Button>
		</div>
	);
};

const Angle = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 0V8C12 12.4183 15.5817 16 20 16H24"
				className="stroke-neutral-medium"
			/>
		</svg>
	);
};

const Line = () => {
	return (
		<svg
			width="24"
			height="24"
			className="h-full"
			viewBox="0 0 24 240"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12 0V2400" className="stroke-neutral-medium" />
		</svg>
	);
};

const AngleLine = () => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 0V8C12 12.4183 15.5817 16 20 16H24"
				className="stroke-neutral-medium"
			/>
			<path d="M12 0V24" className="stroke-neutral-medium" />
		</svg>
	);
};

export const Post = () => {
	const Actions = () => {
		return (
			<div className="flex flex-row gap-2">
				<Reactions count={12} />
			</div>
		);
	};

	const PostBody = () => {
		return (
			<div className="flex flex-col gap-2 pb-6">
				<div className="flex flex-row gap-2">
					<span className="caption">John Doe</span>
					<span className="body-3 text-neutral-strong">6h ago</span>
				</div>
				<p className="body-2">
					U JNA su većina visokopozicioniranih oficira bili Srbi. Zato su tako
					lako i preuzeli kontrolu nad JNA u 91. Srbi i polupismeni Crnogorci su
					upadali u vojne škole bez ikakvih problema. U isto vrijeme su Hrvati
					morali prolaziti rigorozne testove znanja i fizičke spreme da bi upali
					u te iste škole. Pričam iz iskustva.
				</p>
				<Actions />
			</div>
		);
	};

	// thread depth with leaf check for each level
	type ThreadDepth = 'past' | 'last' | 'middle';
	const threadDepth: ThreadDepth[] = ['middle', 'past', 'last', 'middle'];

	const PostThreading = () => {
		return (
			<div className="flex flex-row">
				{threadDepth.slice(0, -2).map((depth, index) => (
					<div key={index} className="w-6 h-full flex flex-col overflow-hidden">
						{(() => {
							switch (depth) {
								case 'past':
									return <></>;
								case 'last':
									return (
										<>
											<Angle />
										</>
									);
								case 'middle':
									return (
										<>
											<Line />
										</>
									);
								default:
									return null;
							}
						})()}
					</div>
				))}

				{/* second last level */}
				<div className="w-6 h-full flex flex-col overflow-hidden">
					{threadDepth[threadDepth.length - 2] === 'last' ? (
						<Angle />
					) : (
						<>
							<AngleLine />
							<Line />
						</>
					)}
				</div>

				{/* last level */}
				<div className="w-6 h-full flex flex-col overflow-hidden">
					{/* show profile image on last level */}
					<div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0">
						<Image src="https://picsum.photos/48/48" alt="John Doe" fill />
					</div>
					{/* check if 'middle' node on last level */}
					{threadDepth[threadDepth.length - 1] === 'middle' ? <Line /> : null}
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-row gap-2">
			<PostThreading />
			<PostBody />
		</div>
	);
};
