import fetch from "node-fetch";
export async function CreatePaste(content: string, language: string, expiration = 0) {
    expiration;
    const res = await fetch("https://vaultb.in/api/pastes", {
        method: "post",
        body: JSON.stringify({
            content,
            language,
            expiration: Date.now() + 150000
        })
    });

    return res.json();
}