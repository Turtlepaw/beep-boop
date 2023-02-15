import { Application, MetaDataTypes, OAuthTokens } from "@airdot/linked-roles";
import { Client } from "discord.js";
import { Logger } from "../logger";

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
        verified: "true"
    });
}

export async function RefreshDiscordMetadata({ LinkedRoles }: Client) {
    LinkedRoles.registerMetaData([{
        key: "verified",
        name: "Verified",
        description: "If the user is verified",
        //@ts-expect-error something with the typings
        type: MetaDataTypes.BOOLEAN_EQUAL
    }]);
}