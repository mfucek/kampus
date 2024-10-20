'use client';

import { ResizeHandle } from '@/lib/react-resizable-handles/components/resize-handle';
import { Post } from '@/modules/discussion/components/post';
import { useSearchParams } from 'next/navigation';
import { Panel } from 'react-resizable-panels';
import { Container } from '../components/container';

export const TopicLayout = () => {
	const postId = useSearchParams().get('postId');
	// @TODO: make postId be a context and only set from the search params
	if (!postId) return null;

	return (
		<>
			<ResizeHandle vertical />
			<Panel
				className="rounded-lg bg-section flex flex-col items-center"
				style={{ overflow: 'hidden', overflowY: 'scroll' }}
			>
				<Container className="py-10">
					<div className="w-full h-full flex flex-col rounded-lg bg-section items-center">
						<Post
							content={{
								type: 'doc',
								content: [
									{
										type: 'paragraph',
										content: [
											{
												type: 'text',
												text: 'U JNA su većina visokopozicioniranih oficira bili Srbi. Zato su tako lako i preuzeli kontrolu nad JNA u 91. Srbi i polupismeni Crnogorci su upadali u vojne škole bez ikakvih problema. U isto vrijeme su Hrvati morali prolaziti rigorozne testove znanja i fizičke spreme da bi upali u te iste škole. Pričam iz iskustva.'
											}
										]
									}
								]
							}}
							votes={{
								likes: 4,
								dislikes: 0,
								userVote: null
							}}
							author={{
								displayName: 'John Doe'
							}}
							postId={postId}
						/>
					</div>
				</Container>
			</Panel>
		</>
	);
};
