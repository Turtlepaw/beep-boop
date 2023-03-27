import { MetaDataTypes, OAuthTokens } from "@airdot/linked-roles";
import { Client } from "discord.js";
import { Logger } from "../logger";
import { FetchUser } from "./Profile";

// add an API route to refresh their metadata when they link their account
// or even add it in the redirect route!
export async function RefreshMetadataService(client: Client) {
    const { LinkedRoles } = client;
    const users = await LinkedRoles.tokenStorage.getAllUsers() as unknown as {
        tokens: OAuthTokens;
        id: string;
    }[];

    Logger.info(`Updating user metadata for ${users.length} users...`);

    for (let i = 0; i < users.length; i++) {
        setTimeout(async () => {
            await updateMetadata(users[i].id, client, LinkedRoles);
        }, i * 1000 * 180);
    }
}

async function updateMetadata(userId: string, client: Client, application) {
    const profile = await FetchUser(userId, client);
    const user = await application.fetchUser(userId);
    return application.setUserMetaData(user.id, user.username, {
        reputation: profile.reputation
    });
}

export async function RefreshDiscordMetadata({ LinkedRoles }: Client) {
    try {
        await LinkedRoles.registerMetaData([{
            key: "reputation",
            name: "Reputation",
            description: "The user's reputation, this can be useful for trusting users.",
            type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL
        }]);
    } catch (e) {
        Logger.error(`Couldn't refresh metadata: ${e}`);
    }
}
