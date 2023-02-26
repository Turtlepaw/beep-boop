import { EmbedBuilder, Guild, Interaction } from "discord.js";
import { Colors } from "../configuration";
import { Verifiers } from "@airdot/verifiers";

export class Embed extends EmbedBuilder {
    private isGuild(guild: unknown): guild is Guild {
        return guild["maximumMembers"] != null;
    }

    public interaction: Interaction;
    public guild: Guild;
    constructor(interactionOrGuild: Interaction | Guild) {
        super();
        this.setColor(Colors.BrandColor);
        if (this.isGuild(interactionOrGuild)) this.guild = interactionOrGuild;
        else this.interaction = interactionOrGuild;

        if (interactionOrGuild != null) this.getColorCache(this.isGuild(interactionOrGuild) ? interactionOrGuild : interactionOrGuild.guild);
    }

    private getColorCache(guild: Guild) {
        if (guild.client.ColorCache.has(guild.id)) {
            this.setColor(guild.client.ColorCache.get(guild.id));
        }
    }

    private async GetColor() {
        if (this.interaction == null && this.guild == null) return;
        //@ts-expect-error legacy
        const { client, guild } = this.interaction ?? this.guild;
        const config = await client.Storage.Configuration.forGuild(guild);
        if (config?.Color == null) return;
        if (!Verifiers.HexColor(config.Color)) return; //throw new Error("config.color must be a hex color");
        this.setColor(config.Color);
    }

    async Resolve() {
        await this.GetColor();
        return this;
    }
}