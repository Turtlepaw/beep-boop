import crypto from "crypto";

const numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];
const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
];
const booleans = [
    true,
    false
];

//Default length is 5 (e.g. 40814)

export function randomNumber() {
    const n = Math.floor(Math.random() * Math.floor(numbers.length - 1)) + 1;

    return numbers[n];
}

export enum AsTypeof {
    Number = "number",
    String = "string"
}

export function generateId(length = 5) {
    let Id = "";
    for (let index = 0; index < length; index++) {
        Id += `${randomNumber()}`
    }

    //if (typeof type == "number") return Number(Id);
    return Id;
}

export function randomBoolean() {
    const n = Math.floor(Math.random() * Math.floor(booleans.length - 1)) + 1;

    return booleans[n];
}

export function randomLetter() {
    const n = Math.floor(Math.random() * Math.floor(letters.length - 1)) + 1;

    return letters[n];
}

export function generatePassword(width = 10) {
    let password = "";
    for (let i = 0; i < width; i++) {
        const shouldBeRandomNumber = randomBoolean();
        const shouldBeUpperCase = randomBoolean();
        if (shouldBeRandomNumber) {
            password += randomNumber();
        } else {
            if (shouldBeUpperCase) {
                password += randomLetter().toString().toUpperCase();
            } else {
                password += randomLetter();
            }
        }
    }
    return password;
}

//Existing is the existing Id's to avoid duplicates
export function advancedId(existing: string[]) {
    let finalId: string;
    for (; ;) {
        const Id = generateId();
        if (!existing.includes(Id)) {
            finalId = Id;
            break;
        } else continue;
    }

    return finalId;
}

export function GenerateToken() {
    return `ApiToken.${crypto.randomUUID()}`;
}
