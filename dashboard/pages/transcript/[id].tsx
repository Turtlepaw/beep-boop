import { Box, Center, Text, Tooltip } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { AutoCenter } from '../../components/AutoCenter';
import { TicketData, Transcript } from '../../utils/api';
import { DefaultProps, Errors, parseUser } from '../../utils/parse-user';
import { Meta } from '../../components/Meta';
import { Image } from '../../components/Image';
import { NotLoggedIn } from '../../components/User';
import { ApiTicket, TicketMessage } from '../../utils/api-types';
import { Menu } from '../../components/Menu';
import { Markdown } from '../../components/Discord/Markdown';

export interface Props extends DefaultProps {
    messages: TicketMessage[];
    ticket: ApiTicket;
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
    const { messages, ticket } = props;

    function GetUser(id: string) {
        const messageUser = messages.find(e => e.User.Id == id);
        if (ticket.Creator.Id == id) return ticket.Creator.Username;
        else if (messageUser != null) return messageUser.User.Username;
        else return id;
    }

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
                <AutoCenter>
                    <h1 className='text-2xl font-bold'>
                        <Image className='inline mr-1' loading='eager' src='/Icons/Channel.svg' width={40} alt='Channel Icon' />
                        ticket-{ticket.Creator.Username.toLowerCase()}
                    </h1>
                    <p className='text-light'>This is the start of a conversation with {ticket.Creator.Username}.</p>
                </AutoCenter>
                <div className='pt-5'>
                    {messages.filter(e => e.Content != "").map(message => {
                        const date = new Date(message.Date);
                        return (
                            <div key={message.Id} className='hover:bg-[#232429] py-2 pb-5'>
                                <div className='pl-10'>
                                    <Image className='rounded-full inline-block' src={message.User.Avatar} width={50} alt={`${message.User.Username}'s Avatar`} />
                                    <div className='inline-grid pl-5'>
                                        <div>
                                            <span className='inline-block font-semibold'>{message.User.Username}</span>
                                            {message.User.Bot && <Box backgroundColor="#5865f2" display="inline-block" width={message.User.Username.startsWith("Beep Boop") ? 12 : 9} borderRadius={3} marginLeft={2}>
                                                <Center>
                                                    {message.User.Username.startsWith("Beep Boop") && <Tooltip hasArrow label={
                                                        <Box>
                                                            Verified Bot
                                                        </Box>
                                                    } placement='top' shouldWrapChildren bg="#18191c" borderRadius={6}>
                                                        <svg width="18" height="18" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg>
                                                    </Tooltip>}
                                                    <Text fontWeight="semibold" fontSize={11}>BOT</Text>
                                                </Center>
                                            </Box>}
                                            <span className='pl-2 text-light' suppressHydrationWarning>{isToday(message.Date) ? "Today at" : `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`} {date.toLocaleTimeString("us", { hour: '2-digit', minute: '2-digit' }).slice()}</span>
                                        </div>
                                        <div>
                                            {message.Content}
                                            {message.Embeds?.length > 0 && message.Embeds.map(embed => (
                                                <div key={embed.title} className="pl-4 rounded-sm mt-1 py-2 border-l-4 border-l-[#5865f2] bg-[#2F3136]">
                                                    <h1 className='font-bold text-lg pb-2'>{embed.title}</h1>
                                                    {embed.fields.map(field => (
                                                        <div key={field.name} className={`${field.inline && "inline"}`}>
                                                            <h2 className='font-semibold'>{field.name}</h2>
                                                            <Markdown getUser={GetUser}>{field.value}</Markdown>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
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
                ticket: null,
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
                ticket: null,
                mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
            }
        }
    }

    const ticket = await TicketData(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);
    return {
        props: {
            user,
            ticket: ticket.fullResult,
            messages: messages.fullResult,
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};