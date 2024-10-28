import { Button } from '@/lib/shadcn/ui/button';

export const DangerZoneSection = () => {
	return (
		<div>
			<Button theme="danger" variant="solid-weak" disabled>
				Delete Account
			</Button>
		</div>
	);
};
