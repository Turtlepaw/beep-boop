import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType, MessageContextMenuCommandInteraction } from "discord.js";
import { Filter } from "../utils/filter";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Delete",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["ManageMessages"],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction) {
        const CustomId = {
            DeleteMessage: "DELETE_MESSAGE",
            BulkDelete: "BULK_DELETE"
        }

        const Buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Delete this Message")
                    .setCustomId(CustomId.DeleteMessage)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("Delete up to here")
                    .setCustomId(CustomId.BulkDelete)
                    .setStyle(ButtonStyle.Secondary)
            );

        const DisabledButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Delete this Message")
                    .setDisabled(true)
                    .setCustomId(CustomId.DeleteMessage)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("Bulk Delete")
                    .setDisabled(true)
                    .setCustomId(CustomId.BulkDelete)
                    .setStyle(ButtonStyle.Secondary)
            );

        const Message = await interaction.reply({
            content: "Here's some options",
            components: [Buttons],
            ephemeral: true
        });

        const Button = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            time: 0,
            filter: Filter({
                member: interaction.member,
                customIds: CustomId
            })
        });

        const MessageSelected = await interaction.options.getMessage("message");
        if (Button.customId == CustomId.DeleteMessage) {
            await interaction.editReply({
                components: [DisabledButtons]
            });
            await MessageSelected.delete();
            await Button.reply({
                content: "Successfully deleted the message.",
                ephemeral: true
            });
        } else if (Button.customId == CustomId.BulkDelete) {
            await Button.deferReply({
                ephemeral: true
            });
            await interaction.editReply({
                components: [DisabledButtons]
            });

            const Messages = await interaction.channel.messages.fetch({
                limit: 99
            });

            const MessageArray = Array.from(Messages.values());
            const MessageIndex = Array.from(Messages.map(e => e.id).values()).indexOf(MessageSelected.id);

            for (let i = 0; i < (MessageIndex + 1); i++) {
                await MessageArray[i].delete();
            }

            await Button.editReply({
                content: `Successfully deleted ${MessageIndex} messages.`,
            });
        }
    }
}