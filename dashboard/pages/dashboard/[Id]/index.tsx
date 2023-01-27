import { Button, Center, Select } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import React, { useState } from 'react';
import { AutoCenter } from '../../../components/AutoCenter';
import { Experimental } from '../../../components/Beta';
import { AddIcon, DownIcon } from '../../../components/Icons';
import { ExternalIcon, Menu } from '../../../components/Menu';
import { SideMenu } from '../../../components/SideMenu';
import { GetChannels } from '../../../utils/api';
import { DefaultProps, parseUser } from '../../../utils/parse-user';
import { APIChannel, APIGuild } from '../../../utils/types';
import { CreateHandler } from '../../../utils/utils';
import { Configuration } from '../../_app';
import { Mentions } from '../../../components/Mention';
import { Permissions } from '../../../utils/permissions';
import { Meta } from '../../../components/Meta';
import { Image } from '../../../components/Image';
import { NotLoggedIn } from '../../../components/User';

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
        <Center>
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
        </Center>
    )
}



export function Title({ children }: { children: string; }) {
    return (
        <h2 className='font-semibold text-lg uppercase'>{children}</h2>
    );
}

export default function Home(props: Props) {
    const { guild, channels } = props;
    if (guild == null) return <NotLoggedIn {...props} />;

    const [SavePanel, SetPanel] = useState(false);
    const [IsSaving, SetSaving] = useState(false);
    const [Channel, SetChannel] = useState("");
    const HandleChannel = CreateHandler(Channel, SetChannel, () => SetPanel(true));
    const SaveSettings = async () => {
        //SetAppeals(guild.Id, Channel)
    };
    const SaveAll = () => {
        SetSaving(!IsSaving)
    }
    const TogglePanel = () => SetPanel(!SavePanel)

    return (
        <>
            <Menu user={props.user} isDashboard mobile={props.mobile} />
            <Meta>Dashboard</Meta>
            <div className='!flex'>
                <SideMenu GuildName={guild.Name} Guilds={props.user.guilds} GuildId={guild.Id} user={props.user} />
                <AutoCenter className='text-center'>
                    <div className='pb-5 card px-10 py-5'>
                        <Center>
                            <img src={guild.IconURL || ""} className="rounded-full w-16" />
                        </Center>
                        <h1 className='font-bold text-4xl pt-5 pb-3'>
                            {guild?.Name}
                        </h1>
                        <Center>
                            <Mentions.Role className='w-[8.6rem] font-semibold'>{Permissions.Role(props.guild)}</Mentions.Role>
                        </Center>
                    </div>

                    <div>
                        <Title>Server Management</Title>
                        <h1>soon</h1>
                    </div>
                    <div className='pt-5'>
                        <Title>Plugins</Title>
                        <Card href={`${props.guild?.Id}/appeals`}>
                            <h1>Appeal Settings</h1>
                        </Card>
                    </div>
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
                channels: [],
                mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
            }
        }
    }

    const guild = user.guilds.find(e => e?.Id == ctx.query.Id);

    if (!guild) {
        return {
            props: {
                user: null,
                guild: null,
                channels: [],
                mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
            }
        }
    }

    const channels = await GetChannels(guild.Id);
    const channel = null; //await GetAppeals(guild.Id);

    return {
        props: {
            user,
            guild,
            channels,
            channel,
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};