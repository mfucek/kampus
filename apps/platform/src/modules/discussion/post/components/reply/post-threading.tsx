'use client';

import Image from 'next/image';
import { type FC } from 'react';

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
			viewBox="0 0 24 24"
			className="h-full"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12 -200 V400" className="stroke-neutral-medium" />
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
			<path d="M12 -200 V400" className="stroke-neutral-medium" />
		</svg>
	);
};

export const PostThreading: FC<{
	imageUrl: string | null | undefined;
	threadDepth: number[];
	previousThreadDepth?: number[];
	nextThreadDepth?: number[];
}> = ({ imageUrl, threadDepth, previousThreadDepth, nextThreadDepth }) => {
	const previousLastMap = previousThreadDepth
		? previousThreadDepth.map((depth) => (depth ? false : true))
		: new Array(threadDepth.length).fill(false);
	const lastMap = threadDepth.map((depth) => (depth ? false : true));

	// if values of same index in previous and last map are both 1, return 0, else 1
	const holeMap = lastMap.map((isLast, index) =>
		previousLastMap[index] && isLast ? true : false
	);

	const hasChildren =
		nextThreadDepth && nextThreadDepth.length > threadDepth.length;

	return (
		<div className="flex flex-row">
			{threadDepth.map((depth, index) => {
				// leave last depth to be handled by the next component
				if (index === 0) return null;

				// hole rendering
				if (holeMap[index])
					return (
						<div
							key={index}
							className="w-6 h-full flex flex-col overflow-hidden"
						/>
					);

				// dynamic line rendering
				const hasLine = depth !== 0;
				const hasAngle = index === threadDepth.length - 1;
				return (
					<div key={index} className="w-6 h-full flex flex-col overflow-hidden">
						{hasAngle && !hasLine && <Angle />}
						{hasLine && !hasAngle && <Line />}
						{hasLine && hasAngle && (
							<>
								<AngleLine />
								<Line />
							</>
						)}
					</div>
				);
			})}

			<div className="w-6 h-full flex flex-col overflow-hidden">
				<div className="w-6 h-6 rounded-full bg-neutral-weak overflow-hidden relative shrink-0">
					{imageUrl && (
						<Image
							src={imageUrl}
							alt="John Doe"
							className="object-cover"
							fill
							sizes="48px"
							quality={50}
						/>
					)}
				</div>
				{hasChildren && <Line />}
			</div>
		</div>
	);
};
