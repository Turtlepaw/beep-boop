import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { Filter } from "../utils/filter";
import { Embed, Emojis } from "../configuration";
import Event from "../lib/Event";

export default class AppealModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;
        if (!interaction.inCachedGuild()) return;
        if (!interaction.customId.startsWith("button-role:")) return;
        const RoleId = interaction.customId.replace("button-role:", "");
        const Role = await interaction.guild.roles.fetch(RoleId);

        if (!interaction.member.roles.cache.has(RoleId)) {
            interaction.member.roles.add(Role);
            await interaction.reply({
                ephemeral: true,
                content: `${Emojis.Success} Successfully assigned you ${Role}.`
            })
        } else {
            interaction.member.roles.remove(Role);
            await interaction.reply({
                ephemeral: true,
                content: `${Emojis.Success} Successfully removed ${Role}.`
            });
        }
    }
}