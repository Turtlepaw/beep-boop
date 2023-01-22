import { Subscriptions } from '../models/Profile';

export const PremiumPerks = {
	[Subscriptions.Basic]: {
		Guilds: 2,
		CustomBots: 1,
	},
	[Subscriptions.Pro]: {
		Guilds: 5,
		CustomBots: 2,
	},
	[Subscriptions.None]: {
		Guilds: 0,
		CustomBots: 0,
	},
};