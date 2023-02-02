import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { AutoCenter } from '../../components/AutoCenter';
import { Experimental, GetKey } from '../../components/Beta';
import { AddIcon } from '../../components/Icons';
import { ExternalIcon, Menu } from '../../components/Menu';
import { DefaultProps, parseUser } from '../../utils/parse-user';
import { Configuration } from '../_app';
import { GenerateInviteURL } from '../../utils/Invite';
import { Meta } from '../../components/Meta';
import { SearchBar } from '../../components/Search';
import { useState } from 'react';
import { NotLoggedIn } from '../../components/User';
import { Image } from '../../components/Image';

export type PageProps = DefaultProps & { inviteURL: string; }
export default function Home(props: PageProps) {
    if (props.user == null) return <NotLoggedIn {...props} />;
    const state = useState("");
    return (
        <div>
            <AutoCenter className='text-center'>
                <Meta>Dashboard</Meta>
                <Menu user={props.user} isDashboard mobile={props.mobile} />
                {/* <div className='pt-5 pb-5'>
                    <h1 className='font-bold text-4xl pb-1'>
                        Select a Server
                    </h1>
                    <p className='text-lg text-light'>Select a server below to start configuring it.</p>
                </div> */}
                <AutoCenter>
                    <h1 className='text-2xl font-bold'>
                        <Image className='inline mr-1' loading='eager' src='/Icons/Search.svg' width={40} alt='Search Icon' />
                        Select a Server
                    </h1>
                    <p className='text-light'>Select a server to start configuring it.</p>
                </AutoCenter>

                <div className='FlexContainer2'>
                    {props.user?.guilds?.map(e => {
                        if (e == null) return;
                        return (
                            <a href={`/dashboard/${e.Id}`} key={e.Id}>
                                <Center>
                                    <div key={e.Id} className={`ActiveCard card px-8 py-4 Guild FlexItem2 ${e.Name.length >= 18 ? "" : "SingleLineGuild"}`}>
                                        <Center>
                                            <img src={e.IconURL || ""} className="w-8 rounded-full mb-2" />
                                        </Center>
                                        <Center>
                                            <span className='text-center font-semibold text-lg'>{e.Name.length >= 18 ? (e.Name.substring(0, 16) + "...") : e.Name}</span>
                                            {/* <ExternalIcon /> */}
                                        </Center>
                                    </div>
                                </Center>
                            </a>
                        )
                    })}
                    <Center>
                        <a href={props.inviteURL}>
                            <div className="ActiveCard card px-8 py-4 Guild FlexItem2">
                                <Center>
                                    <div className='mb-2'>
                                        <AddIcon className="w-10 h-10 px-1 py-1" />
                                    </div>
                                </Center>
                                <Center>
                                    <span className='text-center font-semibold text-lg'>Add to Server</span>
                                    {/* <ExternalIcon /> */}
                                </Center>
                            </div>
                        </a>
                    </Center>
                </div>
            </AutoCenter>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async function (ctx) {
    const user = await parseUser(ctx, true);
    return {
        props: {
            user,
            inviteURL: GenerateInviteURL(true),
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};