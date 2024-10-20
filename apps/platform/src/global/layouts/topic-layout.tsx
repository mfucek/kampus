'use client';

import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { Post } from '@/modules/discussion/components/post';
import { useSearchParams } from 'next/navigation';
import { Panel } from 'react-resizable-panels';

export const TopicLayout = () => {
	const postId = useSearchParams().get('postId');
	// @TODO: make postId be a context and only set from the search params
	if (!postId) return null;

	return (
		<>
			<ResizeHandle vertical />
			<Panel>
				<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
					<p>{postId}</p>
					<Post
						content="U JNA su većina visokopozicioniranih oficira bili Srbi. Zato su tako
					lako i preuzeli kontrolu nad JNA u 91. Srbi i polupismeni Crnogorci su
					upadali u vojne škole bez ikakvih problema. U isto vrijeme su Hrvati
					morali prolaziti rigorozne testove znanja i fizičke spreme da bi upali
					u te iste škole. Pričam iz iskustva."
					/>
				</div>
			</Panel>
		</>
	);
};
