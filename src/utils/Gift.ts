import { Client, User } from "discord.js";
import { Gift } from "src/models/Gift";
import { generateId, generatePassword } from "./Id";

export function GenerateGiftCode() {
    return `${generatePassword(4)}-${generatePassword(4)}-${generatePassword(4)}`
}

export async function CreateGift(from: User) {
    const { client } = from;
    const GiftCode = GenerateGiftCode();
    const Expires = new Date();
    Expires.setMonth(Expires.getMonth() + 2);
    await client.Storage.Gifts.Create({
        From: from.id,
        Redeemed: false,
        GiftCode,
        Expired: false,
        RedeemedAt: null,
        Expires: Expires.toDateString()
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
        gift: Gift
    }
}