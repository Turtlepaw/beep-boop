import React from "react";
import { BrandColor, Configuration } from "../utils/configuration";
import { Image } from "./Image";
import { Center } from "@chakra-ui/react";

function Title({ children }: { children: string; }) {
    return (
        <h1 className="font-semibold text-lg" style={BrandColor}>{children}</h1>
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
                <div className="float-left flex flex-nowrap flex-row">
                    {/* <Image className='mr-2 block !w-[3.6rem] !h-[3.6rem]' src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Smilies/Robot.png" alt="Sad Face" width={30} /> */}
                    <a href="/">
                        <Image className='hover:opacity-80 mr-5 block !w-[3.4rem] !h-[3.4rem]' src={Configuration.Icon.ColoredSVG} alt="Sad Face" width={30} />
                    </a>
                    <div>
                        <a href="/" className="hover:opacity-80">
                            <Center>
                                <h1 className="font-bold text-2xl pb-0.5" style={BrandColor}>Beep Boop</h1>
                            </Center>
                        </a>
                        <a href="/airdot" className="hover:opacity-80">
                            <h2 className="DiscordTag">© 2022 Airdot</h2>
                        </a>
                    </div>
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
