import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react';
import { AutoCenter } from '../../../components/AutoCenter';
import { AddIcon, DownIcon } from '../../../components/Icons';
import { ExternalIcon, Menu } from '../../../components/Menu';
import { GetAppeals, GetChannels, SetAppeals } from '../../../utils/api';
import { DefaultProps, parseUser } from '../../../utils/parse-user';
import { APIChannel, APIGuild } from '../../../utils/types';
import { CreateHandler, CreateSelectHandler } from '../../../utils/utils';
import { Configuration } from '../../_app';
import Select, { StylesConfig } from 'react-select';
import { CreateSaveOptions, Next, SaveAlert } from '../../../components/SaveAlert';
import { SideMenu } from '../../../components/SideMenu';
import { colourStyles } from '../../../components/Select';

export interface Props extends DefaultProps {
    guild: APIGuild | null;
    channels: APIChannel[];
    channel?: string;
}

export function ExpandableCard(props: {
    children: React.ReactNode;
    expand: React.ReactNode;
}) {
    const [isExpanded, setExpanded] = useState(false);
    const Expand = () => setExpanded(!isExpanded)
    return (
        <div className='card ActiveCard'>
            <Center className='px-20 py-4' onClick={Expand}>
                <div className='inline'>
                    {props.children}
                </div>
                <DownIcon className='w-4 inline ml-4' />
            </Center>
            <div className={`bg-[#afafaf] bg-opacity-10 rounded-b-[10px] mt-1 ${isExpanded && "pb-1"}`} >
                {isExpanded && props.expand}
            </div>
        </div>
    )
}

export default function Home(props: Props) {
    const { guild, channels } = props;
    if (guild == null) return (
        <div>
            <AutoCenter>
                <h1 className='font-semibold text-2xl'>😢 You're not logged in!</h1>
                <Center className='pt-5'>
                    <a className='inline px-1.5' href='/api/oauth'>
                        <Button variant="primary" className='inline'>Login</Button>
                    </a>
                    <a className='inline px-1.5' href='/'>
                        <Button variant="secondary" className='inline'>Back Home</Button>
                    </a>
                </Center>
            </AutoCenter>
        </div>
    );
    const options = [
        ...channels.map(e => ({
            value: e.Id,
            label: `#${e.Name}`
        }))
    ];
    const [Channel, SetChannel] = useState("");
    const [ChannelName, SetChannelName] = useState("");
    const [isOpen, setOpen] = CreateSaveOptions();
    const HandleChannel = CreateSelectHandler(Channel, SetChannel, (e: any) => {
        setOpen(true)
        SetChannelName(e?.label)
    });
    const SaveSettings = async () => {
        SetAppeals(guild.Id, Channel)
    };
    const SaveAll = (next: Next) => {
        next();
    }

    return (
        <>
            <Menu user={props.user} isDashboard />
            <div className='!flex'>
                <SideMenu GuildId={guild.Id} user={props.user} />
                <AutoCenter className='text-center'>
                    <div>
                        <Center>
                            {/*<img src={guild.IconURL || ""} className="rounded-full w-16" />*/}
                        </Center>
                        <h1 className='font-bold text-4xl pt-5'>
                            {guild?.Name}
                        </h1>
                        <h2 className='font-bold text-xl DiscordTag pb-5'>
                            Appeal Settings
                        </h2>
                    </div>

                    <div className='Item px-5 py-5 rounded-md'>
                        <AutoCenter className='pt-2'>
                            <h1 className='pb-2 text-lg font-semibold'>Channel</h1>
                            <Select
                                options={options}
                                isSearchable
                                //@ts-expect-error
                                isOptionSelected={e => e.value == Channel}
                                onChange={HandleChannel}
                                className="w-56"
                                placeholder={ChannelName || "Select an option"}
                                defaultValue={{
                                    label: ChannelName || "Select an option",
                                    value: Channel
                                }}
                                styles={colourStyles}
                            />
                        </AutoCenter>
                    </div>
                </AutoCenter >
                <SaveAlert Save={SaveAll} isOpen={isOpen} setOpen={setOpen} />
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
    const user = await parseUser(ctx, true);
    if (!user || user.guilds == null) {
        return {
            props: {
                user: null,
                guild: null,
                channels: []
            }
        }
    }

    const guild = user.guilds.find(e => e?.Id == ctx.query.Id);

    if (!guild) {
        return {
            props: {
                user: null,
                guild: null,
                channels: []
            }
        }
    }

    const channels = await GetChannels(guild.Id);
    const channel = await GetAppeals(guild.Id);

    return {
        props: {
            user, guild, channels, channel
        }
    };
};