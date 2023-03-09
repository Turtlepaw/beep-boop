import { Box, Button, Center, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import { AutoCenter } from '../../components/Layout/AutoCenter';
import { ExternalIcon, Menu } from '../../components/Layout/Menu';
import { DefaultProps, parseUser } from '../../utils/parse-user';
import { Configuration } from '../_app';
import { CSSProperties } from 'react';
import { Meta } from '../../components/Meta';
import { Image, Images } from '../../components/Image';
import { Checkmark16Filled, Checkmark20Filled, Checkmark28Filled, Checkmark32Filled, Dismiss16Filled, Dismiss20Filled } from '@fluentui/react-icons';
import { DiscordIcon, RobotIcon } from '../../components/Robot';
import { LighterText } from '../../utils/styles';
import { FAQ, FaqItem } from '../../components/Layout/FAQ';
import ErrorMessage from '../../components/ErrorMessage';

export default function Branding(props: DefaultProps) {
    const yellow = '#f0b132'
    return (
        <>
            <Menu {...props} />
            <Meta>Branding</Meta>
            <div className="pb-20 pt-5">
                <AutoCenter py={10} className="text-center">
                    <HStack spacing={3} pb={5}>
                        <RobotIcon width={50} />
                        <Dismiss20Filled />
                        <DiscordIcon width={50} fill="white" />
                    </HStack>
                    <Heading fontWeight="semibold" size="md">
                        {/* <Box display="inline" pr={2}>
                            <Checkmark32Filled color='#57F287' />
                        </Box> */}
                        Account Linking Successful
                    </Heading>
                    <Text maxW={480} pt={0.5} style={LighterText}>A strong link between Beep Boop and your Discord account has been made. You can now close this tab and continue to Discord!</Text>
                    <ErrorMessage _stack={{ pt: 1.5 }} _iconColor={yellow} color={yellow}>You can always unlink Beep Boop from user settings.</ErrorMessage>
                </AutoCenter>
            </div >
        </>
    )
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
