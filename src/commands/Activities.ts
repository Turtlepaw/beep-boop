import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, Colors, CommandInteraction, GuildMember, PermissionsBitField, SlashCommandSubcommandBuilder } from "discord.js";
import Command from "../lib/CommandBuilder";
import { Embed } from "../configuration";
import { MultiplayerRockPaperScissors, RockPaperScissors } from "@airdot/activities";
import { SendError } from "../utils/error";

export default class Activities extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Start an activity.",
            GuildOnly: false,
            Name: "activity",
            RequiredPermissions: [],
            SomePermissions: [],
            Subcomamnds: [
                new SlashCommandSubcommandBuilder()
                    .setName("rock_paper_scissors")
                    .setDescription("🪨📄✂️ Rock Paper Scissors!")
                    .addUserOption(e =>
                        e.setName("member")
                            .setDescription("Play with a friend, select the member to invite below.")
                    )
            ]
        });
    }

    async ExecuteCommand(interaction: ChatInputCommandInteraction, client: Client) {
        enum Subcommands {
            RockPaperScissors = "rock_paper_scissors"
        }
        const SubcomamndName = interaction.options.getSubcommand();
        if (SubcomamndName == Subcommands.RockPaperScissors) {
            const Member = interaction.options.getMember("member");
            if (Member != null) {
                if (!(Member instanceof GuildMember)) {
                    SendError(interaction, "CANNOT PROCESS REQUEST: INVALID GUILD MEMBER")
                    return;
                };
                new MultiplayerRockPaperScissors()
                    .setMember(Member)
                    .StartGame(interaction);
            } else {
                new RockPaperScissors()
                    .StartGame(interaction)
            }
        }
    }
}