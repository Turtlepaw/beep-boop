import { ButtonInteraction } from "discord.js";
import { SendAppealMessage } from "../utils/appeals";
import Button from "../lib/ButtonBuilder";

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

        if (res == null) {
            interaction.reply({
                ephemeral: true,
                content: "You haven't set up appeals yet, you can set up appeals using </server:1030997072175968328>"
            })
        }
    }
}