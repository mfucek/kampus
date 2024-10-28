import { env } from '@/env';
import { db } from '@/lib/prisma/db';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

const getPackageFromProductId = (productId: string) => {
	if (productId === env.STRIPE_PRODUCT_ID_MONTHLY_CHEAP) {
		return 'MONTHLY_CHEAP';
	}

	if (productId === env.STRIPE_PRODUCT_ID_MONTHLY_PRO) {
		return 'MONTHLY_PRO';
	}

	return 'MONTHLY_CHEAP';
};

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

				const package_plan = getPackageFromProductId(
					subscription.items.data[0]!.plan.product as string
				);

				await db.account.update({
					where: {
						clerkUserId: subscription.metadata.userId
					},
					data: {
						status: 'ACTIVE',
						package: package_plan,
						stripeCustomerId: subscription.customer as string,
						user: {
							update: {
								badge: package_plan === 'MONTHLY_PRO' ? 'Legenda' : 'Sponzor'
							}
						}
					}
				});
				break;
			}

			case 'checkout.session.completed': {
				const payment = event.data.object;

				if (payment.mode === 'payment') {
					await db.account.update({
						where: {
							clerkUserId: payment.metadata!.userId
						},
						data: {
							status: 'ACTIVE',
							package: 'LIFETIME',
							activeUntil: null
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
							clerkUserId: subscription.metadata.userId
						},
						data: {
							status: 'CANCELLED',
							activeUntil: new Date(subscription.current_period_end * 1000)
						}
					});
				} else {
					await db.account.update({
						where: {
							clerkUserId: subscription.metadata.userId
						},
						data: {
							status: 'ACTIVE',
							activeUntil: null
						}
					});
				}

				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object;

				await db.account.update({
					where: {
						clerkUserId: subscription.metadata.userId
					},
					data: {
						status: 'INACTIVE',
						package: null,
						stripeCustomerId: null,
						activeUntil: null,
						user: {
							update: {
								badge: null
							}
						}
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

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
