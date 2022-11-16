import { Button, Center, Select } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import React, { useState } from 'react';
import { AutoCenter } from '../../../components/AutoCenter';
import { Experimental } from '../../../components/Beta';
import { AddIcon, DownIcon } from '../../../components/Icons';
import { ExternalIcon, Menu } from '../../../components/Menu';
import { SideMenu } from '../../../components/SideMenu';
import { GetAppeals, GetChannels, SetAppeals } from '../../../utils/api';
import { DefaultProps, parseUser } from '../../../utils/parse-user';
import { APIChannel, APIGuild } from '../../../utils/types';
import { CreateHandler } from '../../../utils/utils';
import { Configuration } from '../../_app';

export interface Props extends DefaultProps {
    guild: APIGuild | null;
    channels: APIChannel[];
    channel?: string;
}

export function Card(props: {
    children: React.ReactNode;
    href: string;
}) {
    return (
        <a className='card ActiveCard' href={props.href}>
            <Center className='px-20 py-4'>
                <div className='inline'>
                    {props.children}
                </div>
                <div className='pl-2'>
                    <ExternalIcon />
                </div>
            </Center>
        </a>
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

    const [SavePanel, SetPanel] = useState(false);
    const [IsSaving, SetSaving] = useState(false);
    const [Channel, SetChannel] = useState("");
    const HandleChannel = CreateHandler(Channel, SetChannel, () => SetPanel(true));
    const SaveSettings = async () => {
        SetAppeals(guild.Id, Channel)
    };
    const SaveAll = () => {
        SetSaving(!IsSaving)
    }
    const TogglePanel = () => SetPanel(!SavePanel)

    return (
        <>
            <Menu user={props.user} isDashboard />
            <div className='!flex'>
                <SideMenu GuildName={guild.Name} Guilds={props.user.guilds} GuildId={guild.Id} user={props.user} />
                <AutoCenter className='text-center'>
                    <div>
                        <Center>
                            <img src={guild.IconURL || ""} className="rounded-full w-16" />
                        </Center>
                        <h1 className='font-bold text-4xl pt-5 pb-5'>
                            {guild?.Name}
                        </h1>
                    </div>

                    <Card href={`${props.guild?.Id}/appeals`}>
                        <h1>Appeal Settings</h1>
                    </Card>
                </AutoCenter >
            </div >
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