export function FormatCommandName(text: string) {
    const words = text.split("_");
    return words.map(e => {
        if (e == "whats") return "What's"
        return e.substring(0, 1).toUpperCase() + e.substring(1, e.length)
    }).join(" ");
}