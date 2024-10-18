import { api } from '@/lib/trpc/server';
import { PricingTiers } from '@/modules/profile/components/pricing-tiers';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton
} from '@clerk/nextjs';
import type { FC } from 'react';

const Page: FC = async () => {
	const { userId, account } = await api.me();

	return (
		<div>
			<p>Landing Page</p>

			<SignedOut>
				<SignInButton />
				<SignUpButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>

			<p>Account: {account?.id}</p>
			<p>User: {userId}</p>
			<p>Status: {account?.status}</p>

			{account?.status === 'INACTIVE' && (
				<>
					<PricingTiers />
				</>
			)}
		</div>
	);
};

export default Page;
