import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonComponent, ButtonStyle, Client, ComponentType, ContextMenuCommandType, MessageActionRowComponent, MessageActionRowComponentBuilder, MessageContextMenuCommandInteraction, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder } from "discord.js";
import { Filter } from "../utils/filter";
import { Emojis } from "../configuration";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Add Button",
            CanaryCommand: false,
            GuildOnly: false,
            RequiredPermissions: [],
            SomePermissions: ["ManageRoles", "ManageGuild"],
            Type: ApplicationCommandType.Message
        })
    }

    public async ExecuteContextMenu(interaction: MessageContextMenuCommandInteraction, client: Client) {
        const Target = await interaction.targetMessage;
        const RoleSelector = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("ROLE_SELECT")
                    .addOptions(
                        interaction.guild.roles.cache.filter(e => e.position).map(e =>
                            new SelectMenuOptionBuilder()
                                .setLabel(e.name)
                                .setValue(e.id)
                                .setEmoji(Emojis.Role)
                        )
                    )
            );

        const Message = await interaction.reply({
            content: `${Emojis.Role} Select a role below`,
            components: [
                RoleSelector
            ],
            ephemeral: true,
            fetchReply: true
        });

        const Select = await Message.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: Filter(interaction.member, "ROLE_SELECT"),
            time: 0
        });

        const Role = await interaction.guild.roles.fetch(Select.values[0]);
        const Button = new ButtonBuilder()
            .setCustomId(`button-role:${Role.id}`)
            .setLabel(Role.name);
        const ButtonStyles = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                ButtonBuilder.from(Button)
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(ButtonStyle[ButtonStyle.Primary]),
                ButtonBuilder.from(Button)
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(ButtonStyle[ButtonStyle.Secondary]),
                ButtonBuilder.from(Button)
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(ButtonStyle[ButtonStyle.Danger]),
                ButtonBuilder.from(Button)
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(ButtonStyle[ButtonStyle.Success])
            );

        const StyleMessage = await Select.update({
            content: `${Emojis.Tag} Select a button style`,
            components: [ButtonStyles],
            fetchReply: true
        });

        const Style = await Message.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: Filter(interaction.member,
                ButtonStyle[ButtonStyle.Success],
                ButtonStyle[ButtonStyle.Danger],
                ButtonStyle[ButtonStyle.Primary],
                ButtonStyle[ButtonStyle.Secondary]
            ),
            time: 0
        });

        Button.setStyle(ButtonStyle[Style.customId]);

        await Target.edit({
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        ...(Target.components[0]?.components != null ? Target.components[0].components.map(e => {
                            if (e.type == ComponentType.SelectMenu) {
                                return SelectMenuBuilder.from(e);
                            } else if (e.type == ComponentType.Button) {
                                return ButtonBuilder.from(e);
                            }
                        }) : []),
                        Button
                    )
            ]
        });

        await Style.update({
            components: [],
            content: `${Emojis.Success} Successfully created button role.`
        });
    }
}