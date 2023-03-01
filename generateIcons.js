/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const discord = require("discord.js");
require("colors");
require("dotenv").config();

const client = new discord.Client({
    intents: [
        discord.IntentsBitField.Flags.Guilds
    ]
});

const guilds = [
    "1043579620022292510",
    "1043022010126700574"
];

const defaultIcons = [{
    name: "Bot",
    toString: () => "<:Bot:1040733154656403616>",
    url: "https://cdn.discordapp.com/emojis/1040733154656403616.webp?size=96&quality=lossless"
}]

/**
 * @param {String} name 
 */
function reformat(name) {
    const firstLetter = name.charAt(0);
    return name.replace(firstLetter, firstLetter.toUpperCase()).replaceAll("_", "");
}

client.on("ready", async () => {
    /**
     * @type {discord.Emoji[]}
     */
    const emojis = [...defaultIcons];
    await Promise.all(guilds.map(async guild => {
        const Guild = await client.guilds.fetch(guild);
        const Emojis = await Guild.emojis.fetch();
        Emojis.forEach(emoji => {
            emojis.push(emoji)
        });
        return 1;
    }));

    const DevMode = Boolean(process.env.DEV);
    const Text = `// 🤖 This is an automated function that generates emojis from servers
// 📝 Any edits made in this file will be overwritten
export enum Icons {
${emojis.map(e => `${DevMode == true ? `    /**
        ![${e.name}](${`${e.url}?size=1024`})
    */\n` : ""}    ${reformat(e.name.toString())} = "${e.toString()}"`).join(",\n")}
}`;

    fs.writeFileSync("src/icons.ts", Text);

    setTimeout(() => {
        console.log("✓ ".green + `${emojis.length} emojis generated successfully from ${guilds.length} guilds`.gray);
        process.exit(0);
    }, 1000);
});

client.login(process.env.TOKEN);