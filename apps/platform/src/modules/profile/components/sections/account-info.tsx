'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { useAuth } from '@clerk/nextjs';

export const AccountInfoSection = () => {
	const { data: user } = api.account.getUser.useQuery();
	const { data: account } = api.account.getAccount.useQuery();

	const { signOut } = useAuth();

	return (
		<>
			<div className="flex flex-col p-6 border border-neutral-weak rounded-xl">
				<p className="body-3 text-neutral-strong">Account: {account?.id}</p>
				<p className="body-3 text-neutral-strong">User: {user?.id}</p>
				<p className="body-3 text-neutral-strong">Status: {account?.status}</p>
			</div>
			<Button variant="outline" onClick={() => signOut()}>
				Log out
			</Button>
		</>
	);
};
