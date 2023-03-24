import { Application, MetaDataTypes, OAuthTokens } from "@airdot/linked-roles";
import { Client } from "discord.js";
import { Logger } from "../logger";

// add an API route to refresh their metadata when they link their account
// or even add it in the redirect route!
export async function RefreshMetadataService({ LinkedRoles }: Client) {
    const users = await LinkedRoles.tokenStorage.getAllUsers() as unknown as {
        tokens: OAuthTokens;
        id: string;
    }[];

    Logger.info(`Updating user metadata for ${users.length} users...`);

    for (let i = 0; i < users.length; i++) {
        setTimeout(async () => {
            await updateMetadata(users[i].id, LinkedRoles);
        }, i * 1000 * 180);
    }
}

async function updateMetadata(userId: string, application: Application) {
    const user = await application.fetchUser(userId);
    application.setUserMetaData(user.id, user.username, {
        // add their real rep
        reputation: 15
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
