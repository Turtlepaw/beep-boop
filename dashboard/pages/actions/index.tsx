import { Badge, Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import { Image } from "../../components/Image";
import { AutoCenter } from '../../components/AutoCenter';
import { Feature, FeatureDescription, FeatureIcon, FeatureText, FeatureTitle } from '../../components/Feature';
import { ExternalIcon, Menu } from '../../components/Menu';
import { DefaultProps, parseUser } from '../../utils/parse-user';
import { ButtonStyle, Configuration } from '../_app';
import { Meta } from '../../components/Meta';
import { BrandColor } from '../../components/Link';
import { CustomBadge, Presets } from '../../components/Common';
import { Action, GetActions } from '../../utils/api';

export interface PageProperties extends DefaultProps {
    actions: Action[];
}

export default function Home(props: PageProperties) {
    return (
        <div className='pb-10'>
            <Menu {...props} />
            <Meta>Actions</Meta>
            <AutoCenter>
                {props.actions.map(e => {
                    return (
                        <div className='card px-8 py-5' key={e.Id}>
                            <div className='pb-2'>
                                <Image src={e.Author.Avatar} width={35} className="rounded-full inline-block" />
                                <h2 className='inline-block pl-2 font-medium text-lg'>{e.Author.Username}</h2>
                            </div>
                            <h1 className='text-lg font-semibold'>{e.Name}</h1>
                            <p className='text-light font -medium'>{e.Description}</p>
                            <a href={`/actions/${e.Id}`}>
                                <Button variant={ButtonStyle.BrandColor} className="mt-3">Learn More</Button>
                            </a>
                        </div>
                    )
                })}
            </AutoCenter >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps<PageProperties> = async function (ctx) {
    const user = await parseUser(ctx);
    return {
        props: {
            user,
            actions: await GetActions(),
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};
