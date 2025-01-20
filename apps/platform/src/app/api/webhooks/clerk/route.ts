import { env } from '@/env';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

import { generateRandomName } from '@/utils/generate-random-name';
import type { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
	const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error('Missing webhook secret');
	}

	const headerPayload = await headers();
	const svix_id = headerPayload.get('svix-id');
	const svix_timestamp = headerPayload.get('svix-timestamp');
	const svix_signature = headerPayload.get('svix-signature');

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Missing svix headers', { status: 400 });
	}

	const payload = (await req.json()) as unknown;
	const body = JSON.stringify(payload);

	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature
		}) as WebhookEvent;
	} catch (err) {
		console.error('Error verifying webhook', err);
		return new Response('Error verifying webhook', { status: 400 });
	}

	const { id } = evt.data;
	const eventType = evt.type;

	switch (eventType) {
		case 'user.created':
			const count = await db.account.count({
				where: {
					clerkUserId: id!
				}
			});

			if (!count) {
				await db.account.create({
					data: {
						clerkUserId: id!,
						user: {
							create: {
								displayName: generateRandomName()
							}
						}
					}
				});
			}
			break;
		default:
			console.error(`The event type: ${eventType} is not configured`);
	}

	return new Response('Success', { status: 200 });
}
