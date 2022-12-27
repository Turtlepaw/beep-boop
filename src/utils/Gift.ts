import { Client, User } from "discord.js";
import { Gift } from "../models/Gift";
import { Subscriptions } from "../models/Profile";
import { generateId, generatePassword } from "./Id";

/**
 * Generates a unique gift code by looping until it generates a gift code that doesn't exist in the provided codes.
 * 
 * 1. Generates a code
 * 2. Checks if it exists within the provided codes
 * 3. Returns the code if it doesn't exist or then continues
 */
export function GenerateGiftCode(codes: string[]) {
    for (; ;) {
        const code = `${generatePassword(4)}-${generatePassword(4)}-${generatePassword(4)}`;
        if (codes.includes(code)) continue;
        else return code;
    }
}

export async function CreateGift(from: User, sub: Subscriptions) {
    const { client } = from;
    const codes = await client.Storage.Gifts.GetAll();
    const GiftCode = GenerateGiftCode(codes.map(e => e.GiftCode));
    const Expires = new Date();
    Expires.setMonth(Expires.getMonth() + 2);
    await client.Storage.Gifts.Create({
        From: from.id,
        Redeemed: false,
        GiftCode,
        Expired: false,
        RedeemedAt: null,
        Expires: Expires.toDateString(),
        Type: sub
    });

    return {
        code: GiftCode,
        from,
        redeemed: false,
        expires: Expires
    }
}

export async function RedeemGiftAndExpire(code: string, client: Client) {
    client.Storage.Gifts.Edit({ GiftCode: code }, {
        Redeemed: true,
        RedeemedAt: new Date().toDateString(),
        Expired: true,
        Expires: new Date().toDateString()
    });
}

function fetchGift(code: string, client: Client) {
    return client.Storage.Gifts.Get({
        GiftCode: code
    });
}

export interface ResolvedGift {
    GiftCode: string;
    Redeemed: boolean;
    From: string;
    gift: Gift;
    Expired: boolean;
    Expires: Date;
    RedeemedAt: Date;
    Type: Subscriptions;
}

export async function ResolveGift(code: string, client: Client): Promise<ResolvedGift> {
    const Gift = await fetchGift(code, client);

    return {
        GiftCode: Gift?.GiftCode,
        Redeemed: Gift?.Redeemed ?? false,
        From: Gift?.From ?? "unknown user",
        RedeemedAt: new Date(Gift?.RedeemedAt),
        Expires: new Date(Gift?.Expires),
        Expired: Gift?.Expired ?? (new Date(Gift?.Expires) < new Date()),
        gift: Gift,
        Type: Gift?.Type || Subscriptions.Pro
    }
}