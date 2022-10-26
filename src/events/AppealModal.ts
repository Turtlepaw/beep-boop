import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, Events, GuildMember, Interaction, ModalSubmitInteraction } from "discord.js";
import { Embed } from "../configuration";
import Event from "../lib/Event";

export default class AppealService extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != "APPEAL_MODAL") return;
        const Fields = {
            BanReason: ModalInteraction.fields.getTextInputValue("Q1"),
            RequestReason: ModalInteraction.fields.getTextInputValue("Q2"),
            //DiscordId: ModalInteraction.fields.getTextInputValue("Q3")
        }
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("SEND_APPEAL")
                    .setEmoji("✉️")
                    .setLabel("Send")
                    .setStyle(ButtonStyle.Success)
            )
        await ModalInteraction.reply({
            ephemeral: true,
            components: [Buttons],
            content: "Here's what you'll be sending",
            embeds: [
                new Embed()
                    .setAuthor({
                        name: ModalInteraction.user.username,
                        iconURL: ModalInteraction.user.displayAvatarURL()
                    })
                    .setTitle("Appeal")
                    .addFields([{
                        name: "What did you do to get banned?",
                        value: Fields.BanReason
                    }, {
                        name: "Why should you be unbanned?",
                        value: Fields.RequestReason
                    }, {
                        name: "What's your Discord tag and Id?",
                        value: `${ModalInteraction.user.username} (${ModalInteraction.user.id})`
                    }])
            ]
        });

        const Button = await ModalInteraction.channel.awaitMessageComponent({
            time: 0,
            componentType: ComponentType.Button
        });

        const GuildId = client.storage[ModalInteraction.message.id];
        const Guild = await client.guilds.fetch(GuildId);
        const Channel = await Guild.channels.fetch(client.storage[`${Guild.id}_appeal_channel`]);

        if (Channel.type != ChannelType.GuildText) return;
        const Components = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("APPEALBTN_ACCEPT")
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("APPEALBTN_DENY")
                    .setLabel("Deny")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`BLOCK_${ModalInteraction.user.id}`)
                    .setEmoji("🔨")
                    .setLabel("Block User")
                    .setStyle(ButtonStyle.Danger)
            )


        const Message = Channel.send({
            embeds: [
                new Embed()
                    .setAuthor({
                        name: ModalInteraction.user.username,
                        iconURL: ModalInteraction.user.displayAvatarURL()
                    })
                    .setTitle("Appeal")
                    .addFields([{
                        name: "What did you do to get banned?",
                        value: Fields.BanReason
                    }, {
                        name: "Why should you be unbanned?",
                        value: Fields.RequestReason
                    }, {
                        name: "What's your Discord tag and Id?",
                        value: `${ModalInteraction.user.username} (${ModalInteraction.user.id})`
                    }])
            ]
        })

        client.storage[`pending_${(await Message).id}`] = ModalInteraction.user.id;

        Button.reply({
            content: "👀 Appeal successfully sent, we'll DM you again when the status changes.",
            ephemeral: true
        })
    }
}