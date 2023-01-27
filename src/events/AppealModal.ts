import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Client, ComponentType, Events, Interaction } from "discord.js";
import { Filter } from "../utils/filter";
import { Embed, Icons } from "../configuration";
import Event from "../lib/Event";
import { ModalId, ModalQuestions } from "../buttons/Appeals/AppealButton";
import { InteractionError } from "../utils/error";

export default class AppealModal extends Event {
    constructor() {
        super({
            EventName: Events.InteractionCreate
        });
    }

    async ExecuteEvent(client: Client, ModalInteraction: Interaction) {
        if (!ModalInteraction.isModalSubmit()) return;
        if (ModalInteraction.customId != ModalId) return;
        const AppealMessage = client.QuickStorage[`appealmsg_${ModalInteraction.message.id}`];
        const config = await client.Storage.Configuration.forGuild({
            id: AppealMessage.guild,
            name: "Unknown"
        });
        const Fields = {
            BanReason: ModalInteraction.fields.getTextInputValue(ModalQuestions.BanReason),
            RequestReason: ModalInteraction.fields.getTextInputValue(ModalQuestions.UnbanReason)
        };

        const SendButtonId = "SEND_APPEAL_BUTTON";
        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(SendButtonId)
                    .setEmoji(Icons.Plane)
                    .setLabel("Send")
                    .setStyle(ButtonStyle.Secondary)
            );

        await ModalInteraction.reply({
            ephemeral: true,
            components: [Buttons],
            //content: `${Icons.Plane} Here's what you'll be sending`,
            embeds: [
                new Embed(ModalInteraction.guild)
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
            componentType: ComponentType.Button,
            filter: Filter({
                member: ModalInteraction.member,
                customIds: [SendButtonId]
            })
        });

        if (config?.Appeals?.Channel == null) return InteractionError({
            createError: false,
            ephemeral: true,
            interaction: ModalInteraction,
            message: `Uh oh... It seems that the server hasn't set up appeals properly yet!`,
            error: "APPEAL_CHANNEL_NULLISH",
        });

        const Guild = await client.guilds.fetch(AppealMessage.guild);
        const Channel = await Guild.channels.fetch(config?.Appeals?.Channel);

        if (Channel.type != ChannelType.GuildText) return;
        const Components = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("2RJ4JDWO_ACCEPT")
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(Icons.Success),
                new ButtonBuilder()
                    .setCustomId("2RJ4JDWO_DENY")
                    .setLabel("Deny")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(Icons.Error),
                new ButtonBuilder()
                    .setCustomId(`BLOCK_${ModalInteraction.user.id}`)
                    .setLabel("Block User")
                    .setEmoji(Icons.Lock)
                    .setStyle(ButtonStyle.Secondary)
            )


        const Message = Channel.send({
            components: [Components],
            embeds: [
                new Embed(ModalInteraction.guild)
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

        client.QuickStorage[`pending_${(await Message).id}`] = ModalInteraction.user.id;

        Button.update({
            content: `${Icons.Date} Appeal successfully sent, we'll DM you again when the status changes.`,
            //ephemeral: true
            embeds: [],
            components: []
        });
    }
}
