import { env } from '@/env';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import Stripe from 'stripe';

export const stripeRouter = createTRPCRouter({
	getSubscriptionCheckoutURL: protectedProcedure.query(async ({ ctx }) => {
		const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-09-30.acacia'
		});

		const url = env.URL;

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: 'subscription',
			line_items: [
				{
					price: env.STRIPE_PRICE_MONTHLY_TIER_1,
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
	})
});
