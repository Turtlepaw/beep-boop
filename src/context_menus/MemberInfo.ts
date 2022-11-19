import ContextMenu from "../lib/ContextMenuBuilder";
import { ActionRowBuilder, time, ApplicationCommandType, ButtonBuilder, ButtonStyle, Client, ComponentType, ContextMenuCommandType, ImageFormat, MessageContextMenuCommandInteraction, PermissionFlagsBits, UserContextMenuCommandInteraction, TimestampStyles } from "discord.js";
import { Filter } from "../utils/filter";
import { CreateLinkButton } from "../utils/buttons";
import { Embed } from "../configuration";

export default class DeleteThis extends ContextMenu {
    constructor() {
        super({
            Name: "Member Information",
            CanaryCommand: false,
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: [],
            Type: ApplicationCommandType.User
        })
    }

    public async ExecuteContextMenu(interaction: UserContextMenuCommandInteraction, client: Client) {
        const Member = await interaction.guild.members.fetch(interaction.targetUser.id);
        const User = await interaction.targetUser.fetch();
        const AvatarURL = Member.displayAvatarURL({
            extension: ImageFormat.PNG,
            size: 4096
        });

        await interaction.reply({
            embeds: [
                new Embed()
                    .setAuthor({
                        iconURL: AvatarURL,
                        name: Member.displayName
                    })
                    .setThumbnail(AvatarURL)
                    .setTitle(`Member Information for ${Member.displayName}`)
                    .addFields([{
                        name: "Member Since",
                        value: `${time(Member.joinedAt, TimestampStyles.LongDateTime)} / ${time(Member.joinedAt, TimestampStyles.RelativeTime)}`
                    }, {
                        name: "Discord User Since",
                        value: `${time(User.createdAt, TimestampStyles.LongDateTime)} / ${time(User.createdAt, TimestampStyles.RelativeTime)}`
                    }, {
                        name: "Roles",
                        value: Member.roles.cache.size >= 1 ? Member.roles.cache.filter(e => e.name == "@everyone").map(e => e.toString()).join(" ") : "No roles."
                    }])
                    .setColor(Member.displayColor)
            ],
            components: [
                CreateLinkButton(AvatarURL, "Avatar URL")
            ],
            ephemeral: true
        })
    }
}