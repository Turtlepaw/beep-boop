import { Client, ColorResolvable, User } from "discord.js";
import { Subscriptions } from "../models/Profile";
import { Colors } from "../configuration";
import { HexColorString } from "@airdot/verifiers";

export interface Profile {
    bio?: string;
    userId?: string;
    displayName?: string;
    reputation?: number;
    accentColor?: ColorResolvable;
    subscription?: Subscriptions;
    expires?: Date;
    guilds: Set<string>;
    verfied: boolean;
}

export function CreateUser(user: User, client: Client) {
    client.Storage.Profiles.Create({
        accentColor: null,
        bio: null,
        displayName: user.username,
        reputation: 0,
        userId: user.id,
        subscription: Subscriptions.None,
        expires: null,
        verified: false
    })
}

export async function ResolveUser(Id: string, client: Client): Promise<Profile> {
    let user = await FetchUser(Id, client);
    const ResolvedUser = await client.users.fetch(Id);
    if (user == null) {
        CreateUser(ResolvedUser, client);
        user = await FetchUser(Id, client);
    }

    return {
        accentColor: (user?.accentColor as HexColorString) ?? Colors.Transparent,
        bio: user?.bio || "This user has no bio.",
        displayName: user?.displayName || ResolvedUser.username,
        reputation: user?.reputation || 0,
        userId: user?.userId || ResolvedUser.id,
        subscription: user?.subscription || Subscriptions.None,
        expires: new Date(user?.expires) || null,
        guilds: user?.guilds ?? new Set(),
        verfied: user?.verified ?? false
    }
}

export function FetchUser(Id: string, client: Client) {
    const user = client.Storage.Profiles.Get({ userId: Id });
    return user;
}

export function SetBio(Id: string, bio: string, client: Client) {
    return client.Storage.Profiles.Edit(Id, {
        bio
    });
}

export async function AddGuild(Id: string, guild: string, client: Client) {
    const current = await ResolveUser(Id, client);
    let guilds = current?.guilds;
    if (current.guilds == null) guilds = new Set([guild])
    else guilds.add(guild);

    return client.Storage.Profiles.Edit(Id, {
        guilds
    });
}

export async function RemoveGuild(Id: string, guild: string, client: Client) {
    const current = await ResolveUser(Id, client);
    current.guilds.delete(guild);

    return client.Storage.Profiles.Edit(Id, {
        guilds: current.guilds
    });
}

export function SetDisplayName(Id: string, displayName: string, client: Client) {
    return client.Storage.Profiles.Edit(Id, {
        displayName
    });
}

export function SetAccentColor(Id: string, accentColor: string, client: Client) {
    return client.Storage.Profiles.Edit(Id, {
        accentColor
    });
}

export function SetVerified(Id: string, verified: boolean, client: Client) {
    return client.Storage.Profiles.Edit(Id, {
        verified
    });
}

export function SetSubscription(Id: string, subscription: Subscriptions, expires: Date, client: Client) {
    return client.Storage.Profiles.Edit(Id, {
        subscription,
        expires: expires.toDateString()
    });
}

export async function Endorse(Id: string, client: Client, n = 1, force = false) {
    const rep = await FetchUser(Id, client);
    return client.Storage.Profiles.Edit(Id, {
        reputation: force == true ? n : ((rep?.reputation ?? 0) + n)
    });
}