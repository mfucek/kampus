import { type FC } from 'react';

import { type GeneralTopicsListItem } from '../../api/procedures/general-topic/list-all';

export const GeneralTopicCard: FC<{
	generalTopic: GeneralTopicsListItem;
}> = ({ generalTopic }) => {
	return (
		<div className="p-4 flex flex-row gap-2 rounded-xl bg-section md:bg-neutral-weak items-center clickable h-full">
			<div className="h-8 w-8 shrink-0 rounded-[8px] bg-neutral-medium border border-neutral-weak overflow-hidden">
				{/* <Image
					src={generalTopic.iconSrc ?? 'https://picsum.photos/48/48'}
					alt={generalTopic.name}
					width={48}
					height={48}
				/> */}
			</div>
			<span className="flex-1 button-md text-neutral">
				{generalTopic.topic.name}
			</span>
		</div>
	);
};
