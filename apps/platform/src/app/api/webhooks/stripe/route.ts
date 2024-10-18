import { env } from '@/env';
import { db } from '@/server/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
	try {
		const body = await request.text();
		const sig = request.headers.get('stripe-signature')!;

		const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-09-30.acacia'
		});

		let event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

		switch (event.type) {
			case 'customer.subscription.created': {
				const subscription = event.data.object;
				await db.account.update({
					where: {
						userId: subscription.metadata.userId
					},
					data: {
						status: 'ACTIVE',
						package: 'MONTHLY_CHEAP',
						stripeCustomerId: subscription.customer as string
					}
				});
				break;
			}

			case 'checkout.session.completed': {
				const payment = event.data.object;

				if (payment.mode === 'payment') {
					await db.account.update({
						where: {
							userId: payment.metadata!.userId
						},
						data: {
							status: 'ACTIVE',
							package: 'LIFETIME'
						}
					});
					break;
				}
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object as Stripe.Subscription;

				if (subscription.cancel_at_period_end) {
					await db.account.update({
						where: {
							userId: subscription.metadata.userId
						},
						data: {
							status: 'CANCELLED'
						}
					});
				} else {
					await db.account.update({
						where: {
							userId: subscription.metadata.userId
						},
						data: {
							status: 'ACTIVE'
						}
					});
				}

				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object;

				await db.account.update({
					where: {
						userId: subscription.metadata.userId
					},
					data: {
						status: 'INACTIVE',
						package: null,
						stripeCustomerId: null
					}
				});

				break;
			}
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export const config = {
	api: {
		bodyParser: false
	}
};
