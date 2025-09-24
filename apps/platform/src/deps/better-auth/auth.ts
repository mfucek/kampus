import { env } from '@/env';
import {
	followDefaultTopics,
	initializeUserData,
	logUserCreation,
	sendWelcomeEmail
} from '@/modules/user/on-user-creation';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '../prisma';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			accessType: 'offline',
			prompt: 'select_account consent'
		}
		// github: {
		// 	clientId: process.env.GITHUB_CLIENT_ID,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET
		// }
	},
	emailVerification: {
		sendVerificationEmail: async ({ user: _user, url: _url }) => {
			// implement your logic here to send email verification
		}
	},

	user: {
		additionalFields: {
			badge: {
				type: 'string',
				required: false,
				input: false
			}
		}
	},

	// Database hooks for triggering functions on user events
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					// This function runs after a new user is created
					console.log(`New user created: ${user.email} with ID: ${user.id}`);

					try {
						// Log user creation for analytics
						await logUserCreation({
							id: user.id,
							email: user.email,
							name: user.name
						});

						// Initialize user data (settings, preferences, etc.)
						await initializeUserData(user.id);

						// Follow topics that are set to automatic follow
						await followDefaultTopics(user.id);

						// Send welcome email
						await sendWelcomeEmail(user.email);
					} catch (error) {
						console.error('Error in user creation hook:', error);
						// Don't throw here to avoid breaking the user creation process
					}
				}
				// Optional: before hook to validate or modify user data before creation
				// before: async (user) => {
				//   // Custom validation logic
				//   return { data: user };
				// }
			}
		}
	}
});
