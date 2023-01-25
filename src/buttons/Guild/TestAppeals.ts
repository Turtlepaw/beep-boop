import { ButtonInteraction } from "discord.js";
import { SendAppealMessage } from "../../utils/appeals";
import Button from "../../lib/ButtonBuilder";
import { Icons } from "../../configuration";

export default class TestAppeals extends Button {
    constructor() {
        super({
            CustomId: "TEST_APPEALS",
            GuildOnly: true,
            RequiredPermissions: [],
            SomePermissions: ["Administrator", "ManageGuild"]
        })
    }

    async ExecuteInteraction(interaction: ButtonInteraction) {
        //@ts-expect-error member is a d.js member
        const res = await SendAppealMessage(interaction.member);

        if (res == false) {
            interaction.reply({
                ephemeral: true,
                content: `${Icons.Configure} You haven't set up appeals yet, you can set up appeals using </configuration:1044771997726548031>`
            });
        } else {
            interaction.reply({
                ephemeral: true,
                content: `${Icons.Channel} Sent you a test appeal message.`
            });
        }
    }
}