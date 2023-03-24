import { Badge, Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { AutoCenter } from '../components/Layout/AutoCenter';
import { Feature, FeatureDescription, FeatureIcon, FeatureText, FeatureTitle } from '../components/Feature';
import { ExternalIcon, Menu } from '../components/Layout/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from './_app';
import { Meta } from '../components/Meta';
import { BrandColor } from '../utils/styles';
import { CustomBadge, Presets } from '../components/Common';

export default function Home(props: DefaultProps) {
  return (
    <div className='pb-10'>
      <Menu {...props} />
      <Meta>Home</Meta>
      <AutoCenter>
        <div className='text-center'>
          <CustomBadge preset={Presets.ComingSoon("!px-4 py-1", "Private Beta")} />
          <Center>
            <h1 className='font-bold text-4xl pt-5 pb-1'>
              {/* <img src={Configuration.Icon.SVG} className="w-8 inline-block mb-2 mr-2" /> */}
              Modern bot built for the <span style={BrandColor}>21st century</span>
            </h1>
          </Center>
          <Center>
            <p className='max-w-md pt-1 font-medium text-light text-lg'>{Configuration.Description}</p>
          </Center>
          <Center className='mt-5'>
            <a href='/beta'>
              <Button variant="brand" className='mx-1.5'>
                Join Beta
              </Button>
            </a>
            <a href='/support'>
              <Button variant="secondary" className='mx-1.5'>
                Support Server
              </Button>
            </a>
          </Center>
        </div>
        <div>
          <AutoCenter>
            <h1 className='text-center font-bold text-2xl pt-10 max-w-sm'>Packed with features for your community</h1>
            {/* <h2 className='text-center font-semibold pt-5 text-lg uppercase DiscordTag'>Feature Overview</h2> */}
          </AutoCenter>
          <div className='FlexContainer'>
            <Feature>
              <FeatureIcon Icon='/Icons/Settings.svg' />
              <FeatureText>
                <FeatureTitle>Dashboard</FeatureTitle>
                <FeatureDescription>Quickly manage your server's settings through the dashboard.</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon Icon='/Icons/Ticket.svg' />
              <FeatureText>
                <FeatureTitle>Tickets</FeatureTitle>
                <FeatureDescription>Let users talk to your mods through a private channel.</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon Icon='/Icons/Clipboard.svg' />
              <FeatureText>
                <FeatureTitle>Appeals</FeatureTitle>
                <FeatureDescription>Give users a second chance with in-app appeals.</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon Icon='/Icons/Reward.svg' />
              <FeatureText>
                <FeatureTitle>Levels</FeatureTitle>
                <FeatureDescription>Reward your members for being active with levels.</FeatureDescription>
              </FeatureText>
            </Feature>
            <Feature>
              <FeatureIcon Icon='/Icons/Gift.svg' />
              <FeatureText>
                <FeatureTitle>Advanced Giveaways</FeatureTitle>
                <FeatureDescription>Create advanced giveaways with tons of requirements.</FeatureDescription>
              </FeatureText>
            </Feature>
          </div>
        </div>
      </AutoCenter >
    </div >
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
