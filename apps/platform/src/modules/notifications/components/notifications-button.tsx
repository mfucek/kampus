import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';

export const NotificationsButton = () => {
	return (
		<Button size="sm" variant="ghost" iconOnly>
			<Icon icon="bell" />
			<div className="absolute right-0 top-0 h-3 px-1 flex flex-row items-center justify-center bg-accent text-accent-contrast rounded-[4px] overline">
				21
			</div>
		</Button>
	);
};
