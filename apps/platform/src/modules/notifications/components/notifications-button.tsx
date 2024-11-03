import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';

export const NotificationsButton = () => {
	return (
		<Button size="sm" variant="ghost" iconOnly>
			<Icon icon="bell" />
			<div className="absolute right-0 top-0">
				<Badge size="sm">21</Badge>
			</div>
		</Button>
	);
};
