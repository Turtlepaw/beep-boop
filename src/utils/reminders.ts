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
        const newReminders = client.Storage.GetArray<Reminder>("reminders");
        client.Storage.Delete("reminders");
        client.Storage.Create<Reminder[]>("reminders", [{
            CustomId: Reminder.CustomId,
            Id: Reminder.Id,
            Reminded: true,
            Time: Reminder.Time,
            Title: Reminder.Title,
            CreatedAt: Reminder.CreatedAt
        }, ...newReminders.filter(e => e.CustomId != Reminder.CustomId)])
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
    const Reminders = client.Storage.GetArray<Reminder>("reminders");

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
    const newReminders = client.Storage.GetArray<Reminder>("reminders");
    client.Storage.Delete("reminders");
    client.Storage.Create<Reminder[]>("reminders", [
        ...newReminders.filter(e => e.CustomId == customId)
    ]);
}

export function FormatAll(client: Client) {
    const Reminders = client.Storage.GetArray<Reminder>("reminders");

    return Reminders;
}