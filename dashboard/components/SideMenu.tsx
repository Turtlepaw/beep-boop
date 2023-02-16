import { Button, Center, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Select from 'react-select';
import { Configuration } from '../pages/_app';
import { APIGuild, DiscordUser } from '../utils/types';
import { colourStyles } from './Select';
import { AutoCenter } from './Layout/AutoCenter';
import { BrandColor } from './Utils/Link';
import { RobotIcon } from './Robot';
import { LightText, LighterText } from '../utils/styles';
import { Autocomplete } from "@primer/react";
import Link from 'next/link';

function MenuItem({ children, href, icon }: {
    children: React.ReactNode;
    href: string;
    icon: string;
}) {
    return (
        <a href={href}>
            {/* <div className='px-2 py-2 MenuItem rounded-md font-medium'>
                <Center>
                    {children}
                </Center>
            </div> */}
            <Button variant="MenuItem" width="15rem" height="3rem" className='my-1 py-2' leftIcon={<img src={icon} />}>
                {children}
            </Button>
        </a>
    )
}

export function SideMenu({ GuildId, user, GuildName, Guilds }: { GuildName: string, Guilds: APIGuild[], GuildId: string; user: DiscordUser | null; }) {
    if (user == null) return (<div></div>);
    const options = [
        ...Guilds.map(e => ({
            label: e.Name,
            value: e.Id
        }))
    ];
    return (
        <div className='SideMenu overflow-hidden !w-[18rem] px-8 py-5 overflow-y-auto border-r border-r-[#33353b] mr-10'>
            <Center>
                <a href='/'>
                    <div className='mb-5 hover:opacity-80'>
                        {/* <img src={Configuration.Icon.SVG} className="w-8 ml- mt-  inline-block mr-2" /> */}
                        <HStack>
                            <RobotIcon height="3rem" width="3rem" fill={Configuration.Color} />
                            <VStack pl={5} textAlign="left">
                                <Heading size="md" style={BrandColor}>Beep Boop</Heading>
                                <Text style={LighterText}>Dashboard</Text>
                            </VStack>
                        </HStack>
                    </div>
                </a>
            </Center>
            <Center>
                <Link href='/dashboard' className='text-[1.150rem] font-medium hover:opacity-80'>
                    <img src='/Icons/Return.svg' className='inline' /> Change Server
                </Link>
            </Center>
            <AutoCenter className='pt-2'>
                <MenuItem icon='/Icons/Settings.svg' href={`/dashboard/${GuildId}/`}>Dashboard</MenuItem>
                <MenuItem icon='/Icons/Clipboard.svg' href={`/dashboard/${GuildId}/appeals`}>Appeal Settings</MenuItem>
                <MenuItem icon='/Icons/Ticket.svg' href={`/dashboard/${GuildId}/tickets`}>Tickets</MenuItem>
                <MenuItem icon='/Icons/Reward.svg' href={`/dashboard/${GuildId}/tickets`}>Levels</MenuItem>
            </AutoCenter>
        </div>
    );
};