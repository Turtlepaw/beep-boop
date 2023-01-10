import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react';
import { AutoCenter } from '../components/AutoCenter';
import { ExternalIcon, Menu } from '../components/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from '../pages/_app';
import { Meta } from '../components/Meta';
import { BrandBg, BrandBorder, BrandColor, Link, Links } from '../components/Link';
import { FAQ, FaqItem } from '../components/FAQ';

export function Feature({ included, children }: {
    included?: boolean;
    children: React.ReactNode;
}) {
    if (included == null) included = false;
    const className = "inline";
    return (
        <div>
            {included ? (
                <img src="/Icons/Check.svg" className={className} />
            ) : (
                <img src="/Icons/Dismiss.svg" className={className} />
            )}
            {' '}{children}
        </div>
    )
}

export enum PricingStyle {
    Outlined = "outlined",
    Solid = "solid"
}

export enum PricingButtonStyle {
    Outlined = "brand_outlined",
    Solid = "solid",
    WhiteOutline = "white_outline"
}

export interface PricingTierOptions {
    Features: React.ReactNode;
    Title: string;
    Style: PricingStyle;
    Description: string;
    ButtonLabel?: string;
    ButtonLink?: string;
    ButtonStyle: PricingButtonStyle;
}

export function PricingTier({
    Title,
    Description,
    Features,
    ButtonLabel,
    ButtonLink,
    Style,
    ButtonStyle
}: PricingTierOptions) {
    const Styles = {
        [PricingStyle.Outlined]: BrandBorder,
        [PricingStyle.Solid]: BrandBg
    }
    const ButtonClassName = `
        ${ButtonStyle == PricingButtonStyle.Solid ? "bg-white text-black" : ""}
        ${ButtonStyle == PricingButtonStyle.WhiteOutline ? "hover:bg-white hover:text-black" : ""}
        ${ButtonStyle == PricingButtonStyle.Outlined ? "hover:bg-brand" : ""}
    `;
    const CurrentStyle = Styles[Style];
    const ClassName = {
        className: `inlin e-grid ${Style == PricingStyle.Outlined ? "border-2" : ""} rounded-lg py-8 px-8 mx -3 h- 40 min-h -[32rem] max-h -[32rem] !w-96 my-5 Price FlexItem`
    }
    return (
        <div style={CurrentStyle} className={ClassName.className} >
            <h1 className="text-2xl font-bold">{Title}</h1>
            <p className="font-semibold pt-2 pb-2">{Description}</p>
            {Features}
            <a href={ButtonLink ?? "/support"}>
                <div style={ButtonStyle == PricingButtonStyle.Outlined ? BrandBorder : null} className={`cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 ${ButtonClassName}`}>
                    <Center>{ButtonLabel ?? "Win one at a giveaway"}</Center>
                </div>
            </a>
        </div>
    );
}

export default function Home(props: DefaultProps) {
    const FAQCard = "py-4";
    const FAQTitle = "text-2xl font-bold";
    const FAQDescription = "text-lg max-w-xl pt-1 font-medium";
    return (
        <div className='pb-10'>
            <Menu user={props.user} />
            <Meta>Pricing</Meta>
            <AutoCenter>
                <div className='text-center'>
                    <Center>
                        <h1 className='font-bold text-4xl pt-5 pb-1.5 max-w-lg'>
                            Get a pro subscription and <span style={BrandColor} className="">level up</span> your server
                        </h1>
                    </Center>
                    <Center>
                        <p className='max-w-sm text-lg font-medium text-light'>Get your own custom bot and more with an active pro subscription.</p>
                    </Center>
                </div>
                <h1 className="text-light text-center font-bold text-2xl pt-5 pb-1">Teirs</h1>
                <div className='flexContainer'>
                    <PricingTier
                        Title='Pro'
                        Description='The subscription with a little bit more of everything'
                        Style={PricingStyle.Solid}
                        ButtonStyle={PricingButtonStyle.WhiteOutline}
                        Features={<>
                            <Feature included>5 Servers</Feature>
                            <Feature included>3 Custom Bots</Feature>
                            <Feature included>Everything in Basic</Feature>
                        </>}
                    />
                    <PricingTier
                        Title='Basic'
                        Style={PricingStyle.Outlined}
                        ButtonStyle={PricingButtonStyle.Outlined}
                        Description='The smaller subscription with all the perks'
                        Features={<>
                            <Feature included>2 Servers</Feature>
                            <Feature included>Server Perks</Feature>
                            <Feature included>1 Custom Bot</Feature>
                            <Feature included>Pro Badge</Feature>
                            <Feature included>Vote for future updates</Feature>
                        </>}
                    />
                </div>
                {/* <div style={BrandBorder} className="border-2 rounded-lg py-8 px-8 h- 40 w-96 my-5">
                    <h1 className="text-2xl font-bold">Enterprise</h1>
                    <p className="font-semibold pt-2 pb-2">The subscription for big companies of all kinds</p>
                    <Feature included>Up to 3 Servers</Feature>
                    <Feature included>Up to 5 Custom Bots</Feature>
                    <Feature included>System Updates Premium included</Feature>
                    <Feature included>Fast Support</Feature>
                    <Feature included>Everything in Pro & Basic</Feature>
                    <a href='/support'>
                        <div className="cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 hover:bg-white hover:text-black">
                            <Center>Open a ticket</Center>
                        </div>
                    </a>
                </div> */}
                <AutoCenter className='card px-10 pb-10'>
                    <img src="/Beta.svg" className="w-14 rotate-12 pt-3 pb-8" />
                    <h1 className='font-bold text-xl pb-1'>Early Access</h1>
                    <div className='max-w-sm text-center'>Subscription names are not final and subscriptions may change at any time.</div>
                </AutoCenter>
                <AutoCenter className='text-center'>
                    <h1 className='uppercase text-xl pb- 5 font-bold DiscordTag'>FAQ</h1>
                    <FAQ>
                        <FaqItem title='What perks do servers get?'>
                            Servers with an active subscription:
                            <div className=''>
                                <Feature included>Can set a custom color for all messages</Feature>
                                <Feature included>Get free access to System Updates</Feature>
                            </div>
                        </FaqItem>
                        <FaqItem title="What's System Updates?">
                            System Updates is a bot that can provide the latest Discord-related updates right to your server! <Link href='https://updt.trtle.xyz/'>Learn More</Link>
                        </FaqItem>
                        <FaqItem title="How can you get a subscription?">
                            Currently while premium's in beta, you can only win premium subscriptions at giveaways held in our Discord server. Just hop on into our {Links.Discord} and join a giveaway!
                        </FaqItem>
                    </FAQ>
                </AutoCenter>
            </AutoCenter >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx);
    return { props: { user } };
};