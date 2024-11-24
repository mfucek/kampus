import { cn } from '@/lib/shadcn/utils';
import { cva } from 'class-variance-authority';
import { type FC } from 'react';

export type Sentiment = 'positive' | 'negative' | 'neutral' | 'warning';

const summaryCardVariants = cva(
	'h-full rounded-lg flex flex-col gap-2 p-6 w-[320px] shrink-0',
	{
		variants: {
			sentiment: {
				positive: 'bg-success-weak',
				negative: 'bg-danger-weak',
				neutral: 'bg-neutral-weak',
				warning: 'bg-warning-weak'
			}
		}
	}
);

const sentimentHeadingVariants = cva('text-success-strong title-3', {
	variants: {
		sentiment: {
			positive: 'text-success',
			negative: 'text-danger',
			neutral: 'text-neutral',
			warning: 'text-warning'
		}
	}
});

export const SummaryCard: FC<{
	title: string;
	body: string;
	sentiment: Sentiment;
}> = ({ title, body, sentiment }) => {
	return (
		<div className={cn(summaryCardVariants({ sentiment }))}>
			<p className={cn(sentimentHeadingVariants({ sentiment }))}>{title}</p>
			<p className="body-3">{body}</p>
		</div>
	);
};
