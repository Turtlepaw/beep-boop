import type { DiscordMessageOptions } from '@skyra/discord-components-core/dist/types/options';

declare global {
    interface Window {
        $discordMessage: DiscordMessageOptions;
    }
}