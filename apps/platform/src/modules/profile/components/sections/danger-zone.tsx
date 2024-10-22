import { Button } from '@/lib/shadcn/ui/button';

export const DangerZoneSection = () => {
	return (
		<div>
			<Button theme="danger" variant="outline" disabled>
				Delete Account
			</Button>
		</div>
	);
};
