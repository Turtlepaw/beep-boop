import { Button, Center } from '@chakra-ui/react';
import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Select from 'react-select';
import { Configuration } from '../pages/_app';
import { APIGuild, DiscordUser } from '../utils/types';
import { colourStyles } from './Select';

function MenuItem({ children, href }: {
    children: React.ReactNode;
    href: string;
}) {
    return (
        <a href={href}>
            {/* <div className='px-2 py-2 MenuItem rounded-md font-medium'>
                <Center>
                    {children}
                </Center>
            </div> */}
            <Button variant="MenuItem" width="10rem" className='my-2'>
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
        <div className='SideMenu !w-[15rem] px-8 py-5 overflow-y-auto border-r border-r-[#33353b] mr-10'>
            <a href='/'>
                <div className='mb-5 hover:opacity-80'>
                    <img src={Configuration.Icon.SVG} className="w-8 ml- mt-  inline-block mr-2" />
                    <h1 className='inline-block font-bold text-xl'>Beep Boop</h1>
                </div>
            </a>
            <Select
                options={options}
                isSearchable
                className="w-[10rem]"
                placeholder={"Select an option"}
                defaultValue={{
                    label: GuildName,
                    value: GuildId
                }}
                styles={colourStyles}
            />
            <MenuItem href={`/dashboard/${GuildId}/`}>Home</MenuItem>
            <MenuItem href={`/dashboard/${GuildId}/appeals`}>Appeal Settings</MenuItem>
        </div>
    );
};