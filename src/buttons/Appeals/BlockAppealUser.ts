import { ActionRowBuilder, ButtonInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, inlineCode, userMention } from "discord.js";
import { Embed, Icons } from "../../configuration";
import Button from "../../lib/ButtonBuilder";

export default class BlockAppealUser extends Button {
    constructor() {
        super({
            CustomId: "BLOCK_{any}",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            RequireIdFetching: true
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction, client: Client, Id: string) {
        const config = await client.Storage.Configuration.forGuild(interaction.guild);

        const ModalId = "SET_BLOCK_REASON";
        enum Fields {
            Reason = "BLOCK_REASON"
        }
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId(ModalId)
                .setTitle("Reason")
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel("Reason")
                                .setCustomId(Fields.Reason)
                                .setPlaceholder("Why are you blocking this user?")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        )

        const ModalInteraction = await interaction.awaitModalSubmit({
            time: 0
        });

        const Reason = ModalInteraction.fields.getTextInputValue(Fields.Reason);
        ModalInteraction.reply({
            embeds: [
                new Embed()
                    .setFields([{
                        name: `${Icons.Member} User Blocked`,
                        value: `${inlineCode(Id)} (${userMention(Id)})`
                    }])
                    .setTitle(`${Icons.Shield} User blocked`)
                    .setDescription(`Reason (sent to blocked user):\n\n\`\`\`${Reason}\`\`\``)
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: interaction.user.username
                    })
            ]
        });

        await client.Storage.Configuration.Edit(config.CustomId, {
            AppealBlocks: config.Appeals.Blocked.add(Id)
        });

        const User = client.users.cache.get(Id);

        const Channel = await User.createDM(true);
        Channel.send({
            content: `${Icons.Flag} You've been blocked from appealing, here's what we know:\n\n\`\`\`${Reason}\`\`\``
        });
    }
}