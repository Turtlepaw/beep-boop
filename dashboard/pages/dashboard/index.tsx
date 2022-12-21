import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { AutoCenter } from '../../components/AutoCenter';
import { Experimental, GetKey } from '../../components/Beta';
import { AddIcon } from '../../components/Icons';
import { ExternalIcon, Menu } from '../../components/Menu';
import { DefaultProps, parseUser } from '../../utils/parse-user';
import { Configuration } from '../_app';
import { Meta } from '../../components/Meta';

export default function Home(props: DefaultProps) {
    const key = GetKey();
    return (
        <>
            <Meta>Experimental Dashboard</Meta>
            <Experimental Get={key.Get} Set={key.Set} />
        </>
    );
    return (
        <div>
            <AutoCenter className='text-center'>
                <Menu user={props.user} isDashboard />
                <div>
                    <h1 className='font-bold text-4xl pt-5 pb-5'>
                        Select a Server
                    </h1>
                </div>

                <div>
                    {props.user?.guilds?.map(e => {
                        if (e == null) return;
                        return (
                            <a href={`/dashboard/${e.Id}`}>
                                <Center>
                                    <div key={e.Id} className="ActiveCard card px-8 py-4 Guild">
                                        <Center>
                                            <img src={e.IconURL || ""} className="w-8 rounded-full mb-2" />
                                        </Center>
                                        <Center>
                                            <span className='text-center font-semibold text-lg'>{e.Name.length >= 18 ? (e.Name.substring(0, 16) + "...") : e.Name}</span>
                                            <ExternalIcon />
                                        </Center>
                                    </div>
                                </Center>
                            </a>
                        )
                    })}
                    <Center>
                        <div className="ActiveCard card px-8 py-4 Guild">
                            <Center>
                                <div className='border-solid border-[#FF6060] border-2 rounded-full mb-2'>
                                    <AddIcon className="w-8 h-8 px-1 py-1" />
                                </div>
                            </Center>
                            <Center>
                                <span className='text-center font-semibold text-lg'>Add to Server</span>
                                <ExternalIcon />
                            </Center>
                        </div>
                    </Center>
                </div>
            </AutoCenter>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx, true);
    return { props: { user } };
};