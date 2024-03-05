import ContextMenu from "../lib/ContextMenuBuilder";
import {
  ApplicationCommandType,
  GuildMember,
  UserContextMenuCommandInteraction,
  inlineCode,
} from "discord.js";
import { Embed, Icons } from "../configuration";
import { CleanMember } from "../utils/Clean";
import { InteractionError } from "../utils/error";

export default class DeleteThis extends ContextMenu {
  constructor() {
    super({
      Name: "Clean Nickname",
      CanaryCommand: false,
      GuildOnly: true,
      RequiredPermissions: [],
      SomePermissions: ["ManageNicknames"],
      Type: ApplicationCommandType.User,
    });
  }

  public async ExecuteContextMenu(
    interaction: UserContextMenuCommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });
    if (!(interaction.targetMember instanceof GuildMember)) {
      return await InteractionError({
        interaction,
        error:
          "Member provided failed verifiers (returned API member instead of Discord.js member)",
      });
    }

    const cleaned = await CleanMember(interaction.targetMember as GuildMember);
    if (
      interaction.guild.members.me.roles.highest.position <=
      interaction.targetMember.roles.highest.position
    )
      return await interaction.editReply({
        content: `${Icons.ConfigureAdvanced} This member's position is equal or higher than mine`,
        embeds: [
          new Embed(interaction).setDescription(
            `${inlineCode(
              interaction.targetMember.user.username
            )} -> ${inlineCode(cleaned)}`
          ),
        ],
      });

    await interaction.targetMember.setNickname(cleaned);
    await interaction.editReply({
      content: `${Icons.Flag} Cleaned up their username.`,
      embeds: [
        new Embed(interaction).setDescription(
          `${inlineCode(
            interaction.targetMember.user.username
          )} -> ${inlineCode(cleaned)}`
        ),
      ],
    });
  }
}
