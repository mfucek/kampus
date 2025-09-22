import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';

export const DiscussionTitle = () => {
	return (
		<div className="flex flex-row justify-between items-center">
			<div className="title-2 text-neutral">Rasprava</div>
			<Select value="newest" disabled>
				<SelectTrigger className="w-fit">
					<SelectValue placeholder="Sortiraj" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="newest">Najnovije</SelectItem>
					<SelectItem value="oldest">Najstarije</SelectItem>
					<SelectItem value="relevant">Po relevantnosti</SelectItem>
					<SelectItem value="votes">Po glasovima</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
