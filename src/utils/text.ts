export function FormatCommandName(text: string) {
    const words = text.split("_");
    return words.map(e => {
        if (e == "whats") return "What's"
        return e.substring(0, 1).toUpperCase() + e.substring(1, e.length)
    }).join(" ");
}

export function FormatUsername(text: string) {
    const words = text.split("_");
    return words.map(e => {
        return e.substring(0, 1).toUpperCase() + e.substring(1, e.length)
    }).join(" ");
}

export function formatString(str: string) {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
}