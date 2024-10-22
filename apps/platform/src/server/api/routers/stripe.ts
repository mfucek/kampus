import { env } from '@/env';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { PackageType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import Stripe from 'stripe';
import { z } from 'zod';

export const stripeRouter = createTRPCRouter({
	getSubscriptionCheckoutURL: protectedProcedure
		.input(z.object({ package: z.nativeEnum(PackageType) }))
		.query(async ({ ctx, input }) => {
			const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
				apiVersion: '2024-09-30.acacia'
			});

			const url = env.URL;

			let price_key = '';
			switch (input.package) {
				case 'MONTHLY_CHEAP':
					price_key = env.STRIPE_PRICE_MONTHLY_TIER_1;
					break;
				case 'MONTHLY_PRO':
					price_key = env.STRIPE_PRICE_MONTHLY_TIER_2;
					break;
			}

			const checkoutSession = await stripe.checkout.sessions.create({
				mode: 'subscription',
				line_items: [
					{
						price: price_key,
						quantity: 1
					}
				],
				success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${url}/`,
				subscription_data: {
					metadata: {
						userId: ctx.auth.userId
					}
				}
			});

			if (!checkoutSession.url) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Could not create checkout message'
				});
			}

			return { redirectURL: checkoutSession.url };
		}),

	getLifetimeCheckoutURL: protectedProcedure.query(async ({ ctx }) => {
		const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-09-30.acacia'
		});

		const url = env.URL;

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: 'payment',
			line_items: [
				{
					price: env.STRIPE_PRICE_LIFETIME,
					quantity: 1
				}
			],
			success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url}/`
		});

		if (!checkoutSession.url) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Could not create checkout message'
			});
		}

		return { redirectURL: checkoutSession.url };
	}),

	cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
		const { clerkUserId, db } = ctx;

		const account = await db.account.findUnique({
			where: {
				clerkUserId
			}
		});

		if (!account?.stripeCustomerId) return;

		const stripeCustomerId = account.stripeCustomerId;

		const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-09-30.acacia'
		});

		const subscription = await stripe.subscriptions.list({
			customer: stripeCustomerId
		});

		const subscriptionId = subscription.data[0]!.id;

		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: true
		});

		// await db.account.update({
		// 	where: {
		// 		clerkUserId
		// 	},
		// 	data: {
		// 		status: 'CANCELLED'
		// 	}
		// });

		return { success: true };
	}),

	resumeSubscription: protectedProcedure.mutation(async ({ ctx }) => {
		const { clerkUserId, db } = ctx;

		const account = await db.account.findUnique({
			where: {
				clerkUserId
			}
		});

		if (!account?.stripeCustomerId) return;

		const stripeCustomerId = account.stripeCustomerId;

		const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-09-30.acacia'
		});

		const subscription = await stripe.subscriptions.list({
			customer: stripeCustomerId
		});

		const subscriptionId = subscription.data[0]!.id;

		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: false
		});

		// await db.account.update({
		// 	where: {
		// 		clerkUserId
		// 	},
		// 	data: {
		// 		status: 'ACTIVE'
		// 	}
		// });

		return { success: true };
	})
});
