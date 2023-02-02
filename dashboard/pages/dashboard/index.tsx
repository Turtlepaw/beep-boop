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
            <Menu {...props} />
            <Meta>Experimental Dashboard</Meta>
            <Experimental Get={key.Get} Set={key.Set} />
        </>
    );
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
    const user = await parseUser(ctx);
    return {
        props: {
            user,
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};