import React from "react";
import { BrandColor } from "./Link"

function Title({ children }: { children: string; }) {
    return (
        <h1 className="font-semibold text-lg">{children}</h1>
    )
}

function Link({ children, href }: { children: string; href: string; }) {
    return (
        <>
            <a className="hover:opacity-80" href={href}>{children}</a>
            <br />
        </>
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
                    <a href="/">
                        <h1 className="font-bold text-2xl pb-0.5 hover:opacity-80" style={BrandColor}>
                            Beep Boop
                        </h1>
                    </a>
                    <a href="/airdot" className="hover:opacity-80">
                        <h2 className="DiscordTag">© 2022 Airdot</h2>
                    </a>
                </div>
                <div className="float-right pr-10 flex flex-wrap">
                    <Category>
                        <Title>Legal</Title>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </Category>
                    <Category>
                        <Title>Company</Title>
                        <Link href="/branding">Branding</Link>
                        <Link href="/discord">Discord</Link>
                    </Category>
                    <Category>
                        <Title>Product</Title>
                        <Link href="/pricing">Pricing</Link>
                    </Category>
                </div>
            </div>
        </div>
    );
}
