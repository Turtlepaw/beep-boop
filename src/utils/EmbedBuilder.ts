import { EmbedBuilder, Guild } from "discord.js";
import { Colors } from "../configuration";
import { Verifiers } from "@airdot/verifiers";

export class Embed extends EmbedBuilder {
    public guild: Guild;
    constructor(guild?: Guild) {
        super();
        if (guild != null) this.guild = guild;
        this.setColor(Colors.BrandColor)
        if (guild != null) this.getColorCache(guild);
    }

    private getColorCache(guild: Guild) {
        if (guild.client.ColorCache.has(guild.id)) {
            this.setColor(guild.client.ColorCache.get(guild.id));
        }
    }

    private async GetColor() {
        if (this.guild == null) return;
        const { client } = this.guild;
        const config = await client.Storage.Configuration.forGuild(this.guild);
        if (config?.Color == null) return;
        if (!Verifiers.HexColor(config.Color)) return; //throw new Error("config.color must be a hex color");
        this.setColor(config.Color);
    }

    async Resolve() {
        await this.GetColor();
        return this;
    }
}