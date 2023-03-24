import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, Client, ImageFormat, inlineCode, MessageContextMenuCommandInteraction, PermissionFlagsBits, spoiler, TextChannel } from "discord.js";
import { Embed, Icons } from "../configuration";
import { ShortenURL } from "../utils/Discohook";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Copy Message",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.Message,
            ClientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageWebhooks]
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true })
        const Webhook = await (interaction.channel as TextChannel).createWebhook({
            name: interaction.targetMessage.author.username,
            avatar: interaction.targetMessage.author.avatarURL({ extension: ImageFormat.PNG, size: 2048 })
        });

        client.Storage.CustomWebhooks.Create({
            channelId: interaction.channel.id,
            url: Webhook.url
        });

        const wbMessge = await Webhook.send({
            content: interaction.targetMessage.content,
            components: interaction.targetMessage.components,
            embeds: interaction.targetMessage.embeds,
            files: Array.from(interaction.targetMessage.attachments.values())
        })

        const url = await ShortenURL(wbMessge, Webhook);
        await interaction.editReply({
            embeds: [
                new Embed(interaction)
                    .setDescription(`${spoiler(inlineCode(Webhook.url))}`)
                    .setTitle(`${Icons.Success} Webhook Created`)
                    .addFields([{
                        name: `${Icons.Flag} Keep this secret!`,
                        value: `Someone with this URL can send any message they want to ${interaction.channel}, including ${inlineCode(`@everyone`)} mentions.`
                    }])
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Open in Discohook")
                            .setStyle(ButtonStyle.Link)
                            .setURL(
                                url.url//GenerateURL({ Webhook })
                            )
                    )
            ],
            //ephemeral: true
        });
    }
}