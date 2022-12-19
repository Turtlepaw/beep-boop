export interface DiscordUser {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
    avatarURL: string;
    guilds: (APIGuild | undefined)[] | null;
}

export interface RawDiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string[];
    features: DiscordGuildFeatures[];
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    iconURL: string | null;
    owner: boolean; //if they are the owner
    permissions: string[];
    features: DiscordGuildFeatures[];
    botIn: boolean;
}

export type HexColor = `#${string}`;
export type AvatarDecoration = string;

export interface rawDiscordUser {
    id: string;
    username: string;
    avatar: string; //avatar hash
    avatar_decoration: AvatarDecoration; //coming soon
    discriminator: string;
    public_flags: number;
    banner: string; //hash
    banner_color: HexColor;
    accent_color: HexColor;
};

export interface DiscordUserPartial {
    id: string;
    username: string;
    tag: `${string}#${string}`;
    avatar: string;
    avatarURL: string;
    avatar_decoration: AvatarDecoration;
    discriminator: string;
    public_flags: number;
    banner: string;
    banner_color: HexColor;
    accent_color: HexColor;
    bannerURL: string;
}

export type DiscordGuildFeatures = "ANIMATED_BANNER"
    | "ANIMATED_ICON"
    | "BANNER"
    | "COMMERCE"
    | "COMMUNITY"
    | "DISCOVERABLE"
    | "FEATURABLE"
    | "INVITE_SPLASH"
    | "MEMBER_VERIFICATION_GATE_ENABLED"
    | "MONETIZATION_ENABLED"
    | "MORE_STICKERS"
    | "NEWS"
    | "PARTNERED"
    | "PREVIEW_ENABLED"
    | "PRIVATE_THREADS"
    | "ROLE_ICONS"
    | "SEVEN_DAY_THREAD_ARCHIVE"
    | "THREE_DAY_THREAD_ARCHIVE"
    | "TICKETED_EVENTS_ENABLED"
    | "VANITY_URL"
    | "VERIFIED"
    | "VIP_REGIONS"
    | "WELCOME_SCREEN_ENABLED"

export interface APIGuild {
    Id: string;
    Name: string;
    IconHash: string | null;
    IconURL: string | null;
    IsOwner: boolean; //if they are the owner
    Permissions: string[];
    Features: any[];
    APIVersion: DiscordGuild;
}

export interface APIChannel {
    Id: string;
    Name: string;
}