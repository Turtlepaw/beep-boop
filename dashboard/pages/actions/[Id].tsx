import { Box, Tooltip } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { AutoCenter } from '../../components/Layout/AutoCenter';
import { Menu } from '../../components/Layout/Menu';
import { DefaultProps, parseUser } from '../../utils/parse-user';
import { Action, GetActions } from '../../utils/api';
import { Image } from '../../components/Image';
import { Codeblock } from '../../components/Codeblock';
import { IoInformationCircle } from "react-icons/io5";
import { IconContext } from "react-icons";

export interface PageProperties extends DefaultProps {
    action: Action;
}

export default function Home({ user, action, mobile }: PageProperties) {
    return (
        <div className='pb-10'>

            <Menu user={user} mobile={mobile} />
            <AutoCenter>
                <div className='pb-2'>
                    <Image src={action.Author.Avatar} width={40} className="rounded-full inline" />
                    <h2 className='inline pl-2 font-medium text-lg'>{action.Author.Username}</h2>
                </div>
                <h1 className='text-3xl font-semibold'>{action.Name}</h1>
                <p className='text-light pt-2 font-medium text-lg'>{action.Description}</p>

                <AutoCenter className='pt-8'>
                    <div className='pb-2'>
                        <h1 className='font-medium text-lg inline pr-2'>JavaScript</h1>
                        <Tooltip hasArrow className='inline-block' label={
                            <Box className='pr-2'>
                                The JavaScript code used to run this action.
                            </Box>
                        } placement='right' shouldWrapChildren bg="#292b2f" borderRadius={6} padding='4px 2px 4px 12px'>
                            <IconContext.Provider value={{ color: '#b9bbbe', size: '20px' }}><Box><IoInformationCircle /></Box></IconContext.Provider>
                        </Tooltip>
                    </div>
                    <Codeblock>
                        {action.InternalCode}
                    </Codeblock>
                </AutoCenter>
            </AutoCenter >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps<PageProperties> = async function (ctx) {
    const user = await parseUser(ctx);
    return {
        props: {
            user,
            action: (await GetActions()).find(e => e.Id == ctx.query.Id),
            mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        }
    };
};
