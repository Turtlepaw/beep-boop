import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";

export default class Resources extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "View some useful resources.",
            GuildOnly: false,
            Name: "resources",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Other
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction) {
        const ActionButtons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ICONS")
                    .setLabel("Icon Packs")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("OTHER")
                    .setLabel("Other Resources")
                    .setStyle(ButtonStyle.Secondary)
            );

        const Message = await interaction.reply({
            content: `Select a category`,
            components: [ActionButtons],
            ephemeral: true,
            fetchReply: true
        });

        const collect = Message.createMessageComponentCollector({
            time: 0,
            max: 0,
            componentType: ComponentType.Button
        });

        collect.on("collect", async button => {
            if (button.customId == "ICONS") {
                button.reply({
                    content: `**Open-Source Icon Packs**
- Ionic Icons - <https://ionic.io/ionicons/v4>
- Evil Icons (limited selection) - <https://evil-icons.io/>
- Iconoir - <https://iconoir.com/>
- Hero Icons - <https://heroicons.dev/>
- CSS.gg - <https://css.gg/app>
- Feather Icons - <https://feathericons.com/>
- Remix Icons - <https://remixicon.com/>
- Ikonate - <https://ikonate.com/>
- Unicons - <https://iconscout.com/unicons/explore/line>
**Framework Icon Packs**
- Bootstrap Icons - <https://icons.getbootstrap.com/>
- Eva Icons - <https://akveo.github.io/eva-icons/>
**Popular Icon Packs**
- Font Awesome - <https://fontawesome.com/>
- Fluent Emojis (unofficial viewer) - <https://fluenticons.co/>
- Material Icons - <https://fonts.google.com/icons>
- Octicons (GitHub icons) - <https://primer.style/octicons/>`,
                    ephemeral: true
                });
            } else if (button.customId == "OTHER") {
                button.reply({
                    content: `**Other Discord Resources**
- Discord Icon Builder - <https://www.discordicon.com/>
- Discord Timestamp Builder - <https://hammertime.cyou/>
[read more...](<https://discordresources.com/>)`,
                    ephemeral: true
                });
            }
        });
    }
}