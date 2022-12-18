import React from "react";

function Title({ children }: { children: string; }) {
    return (
        <h1 className="font-semibold text-lg">{children}</h1>
    )
}

function Link({ children, href }: { children: string; href: string; }) {
    return (
        <a className="hover:opacity-80" href={href}>{children}</a>
    )
}

function Category({ children }: { children: React.ReactNode; }) {
    return (
        <div className="px-3">{children}</div>
    )
}

export function Footer() {
    return (
        <div className="bg -[#121314]">
            <hr className="w-full" />
            <div className="pl-10 py- 10 py-16 flex justify-between max-w-screen-xl w-full z-10 flex-wrap">
                <div className="float-left">
                    <h1 className="font-bold text-2xl">
                        Beep Boop
                    </h1>
                    <h2 className="DiscordTag">©️ Airdot</h2>
                </div>
                <div className="float-right pr-10 flex flex-wrap">
                    <Category>
                        <Title>Legal</Title>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/tos">Terms of Service</Link>
                    </Category>
                    <Category>
                        <Title>Company</Title>
                        <Link href="/branding">Branding</Link>
                    </Category>
                </div>
            </div>
        </div>
    );
}
