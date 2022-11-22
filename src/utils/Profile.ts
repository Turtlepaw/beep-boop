import { Client, ColorResolvable, HexColorString, User } from "discord.js";
import { Colors } from "../configuration";

export interface Profile {
    bio?: string;
    userId?: string;
    displayName?: string;
    reputation?: number;
    accentColor?: ColorResolvable;
}

export function CreateUser(user: User, client: Client) {
    client.Storage.Create<Profile>(user.id, {
        accentColor: null,
        bio: null,
        displayName: user.username,
        reputation: 0,
        userId: user.id
    })
}

export async function ResolveUser(Id: string, client: Client): Promise<Profile> {
    let user = FetchUser(Id, client);
    const ResolvedUser = await client.users.fetch(Id);
    if (user == null) {
        CreateUser(ResolvedUser, client);
        user = FetchUser(Id, client);
    }

    return {
        accentColor: user?.accentColor || ResolvedUser.hexAccentColor || Colors.Transparent,
        bio: user?.bio || "This user has no bio.",
        displayName: user?.displayName || ResolvedUser.username,
        reputation: user?.reputation || 0,
        userId: user?.userId || ResolvedUser.id
    }
}

export function FetchUser(Id: string, client: Client) {
    const user = client.Storage.Get<Profile>(Id);
    return user;
}

export function SetBio(Id: string, bio: string, client: Client) {
    return client.Storage.Edit<Profile>(Id, {
        bio
    });
}

export function SetDisplayName(Id: string, displayName: string, client: Client) {
    return client.Storage.Edit<Profile>(Id, {
        displayName
    });
}

export function SetAccentColor(Id: string, accentColor: ColorResolvable, client: Client) {
    return client.Storage.Edit<Profile>(Id, {
        accentColor
    });
}

export function Endorse(Id: string, client: Client) {
    const rep = FetchUser(Id, client);
    return client.Storage.Edit<Profile>(Id, {
        reputation: rep.reputation + 1
    });
}