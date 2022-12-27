import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { AutoCenter } from '../components/AutoCenter';
import { ExternalIcon, Menu } from '../components/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from './_app';
import { Meta } from '../components/Meta';
import { BrandBg, BrandBorder, BrandColor, Link, Links } from '../components/Link';

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
                        <p className='max-w-sm text-lg'>Get your own custom bot and more with an active pro subscription.</p>
                    </Center>
                </div>
                <h1 className="text-light text-center font-bold text-2xl pt-5 pb-1">Teirs</h1>
                <div style={BrandBg} className="rounded-lg py-8 px-8 h- 40 w-96 my-5">
                    <h1 className="text-2xl font-bold">Pro</h1>
                    <p className="font-semibold pt-2 pb-2">The subscription with a little bit more of everything</p>
                    <Feature included>5 Servers</Feature>
                    <Feature included>3 Custom Bots</Feature>
                    <Feature included>Everything in Basic</Feature>
                    <a href='/support'>
                        <div className="cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 hover:bg-white hover:text-black">
                            <Center>Win one at a giveaway</Center>
                        </div>
                    </a>
                </div>
                <div style={BrandBorder} className="border-2 rounded-lg py-8 px-8 h- 40 w-96 my-5">
                    <h1 className="text-2xl font-bold">Basic</h1>
                    <p className="font-semibold pt-2 pb-2">The smaller subscription with all the perks</p>
                    <Feature included>2 Servers</Feature>
                    <Feature included>Custom embed color</Feature>
                    <Feature included>1 Custom Bot</Feature>
                    <Feature included>Pro Badge</Feature>
                    <Feature included>System Updates Premium included</Feature>
                    <Feature included>Vote for future updates</Feature>
                    <a href='/support'>
                        <div className="cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 hover:bg-white hover:text-black">
                            <Center>Win one at a giveaway</Center>
                        </div>
                    </a>
                </div>
                <div style={BrandBorder} className="border-2 rounded-lg py-8 px-8 h- 40 w-96 my-5">
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
                </div>
                <AutoCenter className='card px-8'>
                    <h1 className='font-bold text-xl pb-1'>Early Access</h1>
                    <div className='max-w-sm text-center'>Subscription names are not final and subscriptions may change at any time.</div>
                </AutoCenter>
                <AutoCenter className='text-center'>
                    <h1 className='uppercase text-xl pb- 5 font-bold DiscordTag'>FAQ</h1>
                    <div className={FAQCard}>
                        <h1 className={FAQTitle}>What do servers get?</h1>
                        <p className={FAQDescription}>Servers can set a custom embed color for all embeds sent with Beep Boop and get access to System Updates premium.</p>
                    </div>
                    <div className={FAQCard}>
                        <h1 className={FAQTitle}>What's "System Updates"?</h1>
                        <p className={FAQDescription}>System Updates is a bot that can provide the latest Discord-related updates right to your server! <Link href='https://updt.trtle.xyz/'>Learn More</Link></p>
                    </div>
                    <div className={FAQCard}>
                        <h1 className={FAQTitle}>How can I get premium?</h1>
                        <p className={FAQDescription}>Currently, you can only win premium subscriptions at giveaways held in our Discord server. Just hop on into our {Links.Discord} and join a giveaway!</p>
                    </div>
                </AutoCenter>
            </AutoCenter >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx);
    return { props: { user } };
};
