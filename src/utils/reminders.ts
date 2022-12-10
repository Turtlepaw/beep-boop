import { Client } from "discord.js";
import { Embed, Icons } from "../configuration";

export type Id = `${number}${number}${number}${number}${number}`;
export interface Reminder {
    Id: string,
    Title: string,
    Time: number,
    CustomId: string;
    Reminded: boolean;
    CreatedAt: number;
}

async function Handle(Reminder: Reminder, client: Client) {
    const user = await client.users.fetch(Reminder.Id);
    if (Reminder.Reminded) return;
    try {
        if (Reminder.Reminded) return;
        const DM = await user.createDM(true);
        client.Storage.Reminders.Edit({
            CustomId: Reminder.CustomId
        }, {
            Reminded: true
        });

        await DM.send({
            content: `${Icons.Clock} Times up!`,
            embeds: [
                new Embed()
                    .setDescription(`${Reminder.Title}`)
            ]
        });
    } catch (e) {
        console.log(e);
    }
}

export async function Refresh(client: Client) {
    const Reminders = await client.Storage.Reminders.GetAll();

    for (const Reminder of Reminders) {
        if (Reminder.Reminded) continue;
        const now = new Date()
        const reminderTime = new Date(Date.now() + Reminder.Time)
        if (!Reminder.Reminded && reminderTime < now) {
            Handle(Reminder, client);
            continue;
        }

        setTimeout(async () => {
            if (Reminder.Reminded) return;
            Handle(Reminder, client);
        }, Reminder.Time)
    }
}

export function Delete(customId: string, client: Client) {
    client.Storage.Reminders.Delete({
        CustomId: customId
    });
}

export async function FormatAll(client: Client) {
    const Reminders = await client.Storage.Reminders.GetAll();

    return Reminders;
}