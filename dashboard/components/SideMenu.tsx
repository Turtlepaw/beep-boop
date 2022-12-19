import { Button, Center } from '@chakra-ui/react';
import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Select from 'react-select';
import { Configuration } from '../pages/_app';
import { APIGuild, DiscordUser } from '../utils/types';
import { colourStyles } from './Select';

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
            <Button variant="MenuItem" width="10rem" className='my-2 py-2' leftIcon={<img src={icon} />}>
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
        <div className='SideMenu overflow-hidden !w-[15rem] px-8 py-5 overflow-y-auto border-r border-r-[#33353b] mr-10'>
            {/* <a href='/'>
                <div className='mb-5 hover:opacity-80'>
                    <img src={Configuration.Icon.SVG} className="w-8 ml- mt-  inline-block mr-2" />
                    <h1 className='inline-block font-bold text-xl'>Beep Boop</h1>
                </div>
            </a> */}
            <a href={`/dashboard/${GuildId}`}>
                <div className='mb-5 hover:opacity-80 text-center'>
                    <h1 className='inline-block font-bold text-xl'>Your Dashboard</h1>
                </div>
            </a>
            {/* <Select
                options={options}
                isSearchable
                className="w-[10rem]"
                placeholder={"Select an option"}
                defaultValue={{
                    label: GuildName,
                    value: GuildId
                }}
                styles={colourStyles}
            /> */}
            <a href='/dashboard' className='text-[1.150rem] font-medium hover:opacity-80'>
                <img src='/Icons/Return.svg' className='inline' /> Change Server
            </a>
            <div className='pt-2'>
                <MenuItem icon='/Icons/Settings.svg' href={`/dashboard/${GuildId}/`}>Dashboard</MenuItem>
                <MenuItem icon='/Icons/Clipboard.svg' href={`/dashboard/${GuildId}/appeals`}>Appeal Settings</MenuItem>
                <MenuItem icon='/Icons/Ticket.svg' href={`/dashboard/${GuildId}/tickets`}>Tickets</MenuItem>
                <MenuItem icon='/Icons/Reward.svg' href={`/dashboard/${GuildId}/tickets`}>Levels</MenuItem>
            </div>
        </div>
    );
};