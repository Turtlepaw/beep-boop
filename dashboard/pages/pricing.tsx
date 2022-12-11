import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { AutoCenter } from '../components/AutoCenter';
import { ExternalIcon, Menu } from '../components/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from './_app';

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
    return (
        <div className='pb-10'>
            <Menu user={props.user} />
            <AutoCenter>
                <div className='text-center'>
                    <Center>
                        <h1 className='font-bold text-4xl pt-5 pb-1.5 max-w-lg'>
                            Get a pro subscription and level up your server
                        </h1>
                    </Center>
                    <Center>
                        <p className='max-w-sm text-lg'>Get your own custom bot plus more with an active pro subscription.</p>
                    </Center>
                </div>
                <h1 className="text-light text-center font-bold text-2xl pt-5 pb-1">Teirs</h1>
                <div className="bg-[#5865f2] rounded-lg py-8 px-8 h- 40 w-96 my-5">
                    <h1 className="text-2xl font-bold">Plus</h1>
                    <p className="font-semibold pt-2 pb-2">The subscription with a little bit more of everything</p>
                    <Feature included>5 Custom Bots</Feature>
                    <Feature included>Everything in Pro</Feature>
                    <a href='/support'>
                        <div className="cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 hover:bg-white hover:text-black">
                            <Center>Win one at a giveaway</Center>
                        </div>
                    </a>
                </div>
                <div className="border-2 border-[#5865f2] rounded-lg py-8 px-8 h- 40 w-96 my-5">
                    <h1 className="text-2xl font-bold">Pro</h1>
                    <p className="font-semibold pt-2 pb-2">The smaller subscription with all the perks</p>
                    <Feature included>1 Custom Bot</Feature>
                    <Feature included>Pro Badge</Feature>
                    <a href='/support'>
                        <div className="cursor-pointer rounded-lg mt-6 font-semibold border-white border-2 py-3 w- 36 hover:bg-white hover:text-black">
                            <Center>Win one at a giveaway</Center>
                        </div>
                    </a>
                </div>
                <AutoCenter className='card px-8'>
                    <h1 className='font-bold text-xl pb-1'>Early Access</h1>
                    <div className='max-w-sm text-center'>Subscription names are not final and subscriptions may change at any time.</div>
                </AutoCenter>
            </AutoCenter >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx);
    return { props: { user } };
};
