import { CommandInteraction, inlineCode } from "discord.js";
import Command, { Categories } from "../lib/CommandBuilder";
import { Dot } from "../configuration";
import { DocGen, GenericVarible } from "../utils/Varibles";

export default class Varibles extends Command {
    constructor() {
        super({
            CanaryCommand: false,
            Description: "Shows you available varibles.",
            GuildOnly: true,
            Name: "varibles",
            RequiredPermissions: [],
            SomePermissions: [],
            Category: Categories.Other
        });
    }

    async ExecuteCommand(interaction: CommandInteraction) {
        const Resolver = (name: string, varible: GenericVarible, type: "Member" | "User" | "Guild") => ({
            Input: `${Dot.System} ${name} ${inlineCode(varible.Name)}`,
            Type: type
        });
        let Results = DocGen<{ Input: string; Type: "Member" | "User" | "Guild" }>(Resolver) as unknown as ({ Input: string; Type: "Member" | "User" | "Guild" })[];
        //@ts-expect-error we know this is ok
        Results = [...Results[0], ...Results[1], ...Results[2]];
        const Run = (v) => `${v.Input}`;
        await interaction.reply({
            content: `
**Server Varibles:**\n${Results.filter(e => e.Type == "Guild").map(e => Run(e)).join("\n")}
**Member Varibles:**\n${Results.filter(e => e.Type == "Member").map(e => Run(e)).join("\n")}
**User Varibles:**\n${Results.filter(e => e.Type == "User").map(e => Run(e)).join("\n")}`,
            ephemeral: true
        });
    }
}