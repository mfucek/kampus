import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/server';

export const AccountInfoSection = async () => {
	const user = await api.account.getUser();
	const account = await api.account.getAccount();

	return (
		<>
			<div className="flex flex-col p-6 border border-neutral-weak rounded-xl">
				<p className="body-3 text-neutral-strong">Account: {account?.id}</p>
				<p className="body-3 text-neutral-strong">User: {user.id}</p>
				<p className="body-3 text-neutral-strong">Status: {account?.status}</p>
			</div>
			<Button variant="outline">Log out</Button>
		</>
	);
};
