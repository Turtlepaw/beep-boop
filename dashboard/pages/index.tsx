import { Button, Center } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import { AutoCenter } from '../components/AutoCenter';
import { Menu } from '../components/Menu';
import { DefaultProps, parseUser } from '../utils/parse-user';
import { Configuration } from './_app';

export default function Home(props: DefaultProps) {
  return (
    <div>
      <AutoCenter className='text-center'>
        <Menu user={props.user} />
        <div>
          <h1 className='font-bold text-4xl pt-5 pb-1'>
            <img src={Configuration.Icon.SVG} className="w-8 inline-block mb-2 mr-2" />
            {Configuration.Title}
          </h1>
          <p className='max-w-sm text-lg'>{Configuration.Description}</p>
        </div>
      </AutoCenter>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<DefaultProps> = async function (ctx) {
  const user = await parseUser(ctx);
  return { props: { user } };
};
