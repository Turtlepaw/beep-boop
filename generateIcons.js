/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const discord = require("discord.js");
require("colors");
require("dotenv").config();

const client = new discord.Client({
  intents: [discord.IntentsBitField.Flags.Guilds],
});

const guilds = ["1043579620022292510", "1043022010126700574"];

const defaultIcons = [
  {
    name: "Bot",
    toString: () => "<:Bot:1040733154656403616>",
    imageURL: (options) =>
      `https://cdn.discordapp.com/emojis/1040733154656403616.${
        options?.extension ?? "webp"
      }?size=${options?.size ?? 96}&quality=lossless`,
  },
];

/**
 * @param {String} name
 */
function reformat(name) {
  const firstLetter = name.charAt(0);
  return name
    .replace(firstLetter, firstLetter.toUpperCase())
    .replaceAll("_", "");
}

client.on("ready", async () => {
  /**
   * @type {discord.Emoji[]}
   */
  const emojis = [...defaultIcons];
  await Promise.all(
    guilds.map(async (guild) => {
      const Guild = await client.guilds.fetch(guild);
      const Emojis = await Guild.emojis.fetch();
      Emojis.forEach((emoji) => {
        emojis.push(emoji);
      });
      return 1;
    })
  );

  const DevMode = Boolean(process.env.DEV);
  const DefaultOptions = { size: 1024, extension: "webp" };
  const Text = `// 🤖 This is an automated function that generates emojis from servers
// 📝 Any edits made in this file will be overwritten
export interface Icon {
  toString: () => string;
  id: string;
  url: string;
}

export const Icons: Record<string, Icon> = {
${emojis
  .map(
    (e) =>
      `${
        DevMode == true
          ? `    /**
        ![${e.name}](${`${e.imageURL(DefaultOptions)}`})
    */\n`
          : ""
      }    ${reformat(
        e.name.toString()
      )}: { toString: () => "${e.toString()}", id: "${
        e.id
      }", url: "${e.imageURL(DefaultOptions)}" }`
  )
  .join(",\n")}
}`;
  const URLText = `\n\nexport enum IconURLs {
${emojis
  .map(
    (e) =>
      `${
        DevMode == true
          ? `    /**
        ![${e.name}](${`${e.imageURL(DefaultOptions)}`})
    */\n`
          : ""
      }    ${reformat(e.name.toString())} = "${e.imageURL()}"`
  )
  .join(",\n")}
}`;

  const ComponentText = `// 🤖 This is an automated function that generates emojis from servers
// 📝 Any edits made in this file will be overwritten
import Image, { ImageProps as NextImageProps } from "next/image";
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type ImageProps = Optional<NextImageProps, "alt" | "src"> & { size?: number; };

export const Icons = {
${emojis
  .map(
    (e) =>
      `${
        DevMode == true
          ? `    /**
        ![${e.name}](${`${e.imageURL(DefaultOptions)}`})
    */\n`
          : ""
      }    ${reformat(
        e.name.toString()
      )}: (props?: ImageProps) => <Image src="${e.imageURL({
        size: 1024,
      })}" alt="${
        e.name
      }" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />`
  )
  .join(",\n")}
}`;

  const dashPath = "dashboard/components/icons.tsx";
  const srcPath = "src/icons.ts";
  const dashExists = fs.existsSync(dashPath);
  const srcExists = fs.existsSync(srcPath);
  if (dashExists && srcExists) {
    const srcReadText = fs.readFileSync(srcPath, "utf-8");
    const dashReadText = fs.readFileSync(dashPath, "utf-8");
    if (Text + URLText == srcReadText && ComponentText == dashReadText) {
      console.log("X ".red + `No emojis need to be generated`.gray);
      return process.exit(0);
    }
  }

  fs.writeFileSync(srcPath, Text + URLText);
  fs.writeFileSync(dashPath, ComponentText);

  setTimeout(() => {
    console.log(
      "✓ ".green +
        `${emojis.length} emojis generated successfully from ${guilds.length} guilds`
          .gray
    );
    process.exit(0);
  }, 1000);
});

client.login(process.env.TOKEN);
