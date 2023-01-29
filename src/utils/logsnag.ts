import { Client } from "discord.js";
import { customClients } from "./customBot";
import { Subscriptions } from "../models/Profile";
import { USE_LOGSNAG } from "..";

export async function Logsnag(client: Client) {
    //Make a fake logsnag client to prevent crashes
    if(USE_LOGSNAG == false) return;
    const logsnag = client.LogSnag;

    setInterval(async () => {
        const Guilds = await client.guilds.fetch();
        const Users = client.users.cache;
        await Promise.all(Object.values(customClients).map(async cli => {
            cli.users.cache.forEach(e => Users.set(e.id, e));
            return (await cli.guilds.fetch()).map(e => {
                Guilds.set(e.id, e);
                return null;
            });
        }));

        await logsnag.insight({
            title: "Servers",
            value: Guilds.size,
            icon: "🪴"
        });

        await logsnag.insight({
            title: "Users",
            value: Users.size,
            icon: "🙂"
        });

        // Subscriptions
        const Profiles = await client.Storage.Profiles.GetAll();
        const PremiumUsers = await Profiles.filter(e => e.subscription != null && e.subscription != Subscriptions.None);

        await logsnag.insight({
            title: "Premium Users",
            value: PremiumUsers.length,
            icon: "🚀"
        });

        // Custom Bots
        const CustomBots = await client.Storage.CustomBots.GetAll();

        await logsnag.insight({
            title: "Custom Bots",
            value: CustomBots.length,
            icon: "🤖"
        });

        await logsnag.insight({
            title: "Active Bots",
            value: Object.values(customClients).length,
            icon: "💡"
        });
    }, 10000);
}
