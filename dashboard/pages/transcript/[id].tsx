import { Button, Center, Select } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { AutoCenter } from '../../components/AutoCenter';
import { SideMenu } from '../../components/SideMenu';
import { GetChannels, Transcript } from '../../utils/api';
import { DefaultProps, Errors, parseUser } from '../../utils/parse-user';
import { APIChannel, APIGuild } from '../../utils/types';
import { CreateHandler } from '../../utils/utils';
import { Configuration } from '../_app';
import { Mentions } from '../../components/Mention';
import { Permissions } from '../../utils/permissions';
import { Meta } from '../../components/Meta';
import { Image } from '../../components/Image';
import { NotLoggedIn } from '../../components/User';
import { TicketMessage } from '../../utils/api-types';
import { Menu } from '../../components/Menu';

export interface Props extends DefaultProps {
    messages: TicketMessage[];
}

export function Title({ children }: { children: string; }) {
    return (
        <h2 className='font-semibold text-lg uppercase'>{children}</h2>
    );
}

function isToday(_date: any) {
    const today = new Date();
    const date = new Date(_date);
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
}

export default function Home(props: Props) {
    const { messages } = props;

    console.log(messages)
    if (props.error == Errors.NotLoggedIn) return <NotLoggedIn {...props} />;
    if (messages == null) return (
        <>
            <Menu user={props.user} isDashboard mobile={props.mobile} />
            <Meta>Ticket Not Found</Meta>
            <div className='pb-20 pt-10'>
                <Center>
                    <Image className='mr-2 !w-[3.6rem] !h-[3.6rem] inline' loading='eager' src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Travel%20and%20places/Flying%20Saucer.png" alt="Magic Wand" width={200} />
                    <h1 className='font-bold text-4xl pt-5 pb-1.5 max -w-[rem] text-center'>
                        That ticket transcript doesn't exist.
                    </h1>
                </Center>
                <Center>
                    <p className='text-light text-lg pt-1'>
                        Maybe in another realm or timeline.
                    </p>
                </Center>
            </div>
        </>
    );

    return (
        <>
            <Menu user={props.user} isDashboard mobile={props.mobile} />
            <Meta>Ticket Transcript</Meta>
            <div className='py-10'>
                <h1>
                    ticket
                </h1>
                {messages.filter(e => e.Content != "").map(message => {
                    const date = new Date(message.Date);
                    return (
                        <div key={message.Id} className='hover:bg-white hover:bg-opacity-5 py-2 pb-5'>
                            <div className='pl-10'>
                                <Image className='rounded-full inline-block' src={message.User.Avatar} width={50} alt={`${message.User.Username}'s Avatar`} />
                                <div className='inline-grid pl-5'>
                                    <div>
                                        <span className='inline-block font-semibold'>{message.User.Username}</span>
                                        <span className='pl-2 text-light' suppressHydrationWarning>{isToday(message.Date) ? "Today at" : `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} {date.toLocaleTimeString("us", { hour: '2-digit', minute: '2-digit' }).slice()}</span>
                                    </div>
                                    <div>
                                        {message.Content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
    const user = await parseUser(ctx);
    if (!user) {
        return {
            props: {
                user: null,
                messages: null,
                error: Errors.NotLoggedIn,
                mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
            }
        }
    }

    const messages = await Transcript(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);

    if (messages.isError()) {
        return {
            props: {
                error: Errors.NotFound,
                messages: null,
                user,
                mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
            }
        }
    }

    return {
        props: {
            user,
            messages: messages.fullResult,
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};