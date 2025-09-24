import { db } from '@/deps/prisma';

/**
 * Example functions that can be triggered when a new user is created
 * These can be called from the Better Auth database hook
 */

/**
 * Follow topics that are set to be automatically followed by new users
 */
export async function followDefaultTopics(userId: string) {
	try {
		// Find topics that should be automatically followed
		const topicsToFollow = await db.topic.findMany({
			where: {
				automaticFollow: true
			},
			select: {
				id: true
			}
		});

		// Create TopicFollow records for each topic
		const followPromises = topicsToFollow.map((topic) =>
			db.topicFollow.upsert({
				where: {
					userId_topicId: {
						userId,
						topicId: topic.id
					}
				},
				update: {
					active: true
				},
				create: {
					userId,
					topicId: topic.id,
					active: true
				}
			})
		);

		await Promise.all(followPromises);

		console.log(
			`User ${userId} automatically followed ${topicsToFollow.length} topics`
		);
	} catch (error) {
		console.error('Error following default topics:', error);
	}
}

/**
 * Initialize user with default settings or data
 */
export async function initializeUserData(userId: string) {
	try {
		// Example: Set default user preferences
		// You could add a UserPreferences model to your schema

		// Example: Create default notifications settings
		// You could add a UserSettings model to your schema

		// Example: Log user creation for analytics
		console.log(`Initializing user data for: ${userId}`);

		// Add any other initialization logic here
	} catch (error) {
		console.error('Error initializing user data:', error);
	}
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userEmail: string) {
	try {
		// Implement your email sending logic here
		// You might use services like SendGrid, AWS SES, Resend, etc.

		console.log(`Sending welcome email to: ${userEmail}`);

		// Example implementation:
		// await emailService.send({
		//   to: userEmail,
		//   subject: 'Welcome to Kampus!',
		//   template: 'welcome',
		//   data: { userEmail }
		// });
	} catch (error) {
		console.error('Error sending welcome email:', error);
	}
}

/**
 * Log user creation for analytics or monitoring
 */
export async function logUserCreation(user: {
	id: string;
	email: string;
	name: string;
}) {
	try {
		// Log to your analytics service
		// Example: PostHog, Mixpanel, etc.

		console.log(`User created:`, {
			id: user.id,
			email: user.email,
			name: user.name,
			timestamp: new Date().toISOString()
		});

		// Example PostHog tracking:
		// posthog.capture({
		//   distinctId: user.id,
		//   event: 'user_created',
		//   properties: {
		//     email: user.email,
		//     name: user.name
		//   }
		// });
	} catch (error) {
		console.error('Error logging user creation:', error);
	}
}
