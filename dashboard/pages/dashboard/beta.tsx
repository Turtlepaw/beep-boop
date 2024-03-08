import {
  Box,
  Button,
  Center,
  Code,
  IconButton,
  Spinner,
  VStack,
  useClipboard,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { AutoCenter } from "../../components/Layout/AutoCenter";
import { AddIcon } from "../../components/oldIcons";
import { Menu } from "../../components/Layout/Menu";
import { ConfigProps, DefaultProps, parseUser } from "../../utils/parse-user";
import { GenerateInviteURL } from "../../utils/Invite";
import { Meta } from "../../components/Meta";
import { useEffect, useState } from "react";
import { AuthenticationLoading, NotLoggedIn } from "../../components/User";
import { Image } from "../../components/Image";
import { config } from "../../utils/config";
import { SWRManager, useFetchOptions } from "../../utils/swr";
import { Routes } from "../../utils/api-types";
import { APIGuild } from "../../utils/types";
import ErrorMessage from "../../components/ErrorMessage";
import {
  ChevronDown20Filled as DownIcon,
  ChevronUp20Filled as UpIcon,
} from "@fluentui/react-icons";
import { Configuration } from "../../utils/configuration";
import { NextLink } from "../../components/Utils/Link";
import { Icons } from "../../components/icons";
import { useSession } from "next-auth/react";
import { SWRResponse } from "swr";

export type PageProps = DefaultProps & { inviteURL: string } & ConfigProps;
export default function Home(props: PageProps) {
  const { data, status } = useSession();
  const swr = new SWRManager(props.privateKey, props.apiUri);
  let guilds = swr.useFetch<APIGuild[]>({
    route: Routes.GuildsWith + `?id=${data?.user?.id}`,
  });
  const Clipboard = useClipboard(guilds.error);
  const [expanded, expand] = useState(false);
  if (status == "loading") return <AuthenticationLoading {...props} />;
  if (status == "unauthenticated") return <NotLoggedIn {...props} />;

  console.log(guilds.data);

  return (
    <div>
      <AutoCenter className="text-center" pb={5}>
        <Meta>Dashboard</Meta>
        <Menu isDashboard />
        {/* <div className='pt-5 pb-5'>
                    <h1 className='font-bold text-4xl pb-1'>
                        Select a Server
                    </h1>
                    <p className='text-lg text-light'>Select a server below to start configuring it.</p>
                </div> */}
        <AutoCenter pt={5} pb={2}>
          <h1 className="text-2xl font-bold">
            <Icons.Search className="inline mr-1" loading="eager" size={40} />
            {/* <Image
              className="inline mr-1"
              loading="eager"
              src={Icons}
              width={40}
              alt="Search Icon"
            /> */}
            Select a Server
          </h1>
          <p className="text-light">Select a server to start configuring it.</p>
        </AutoCenter>

        {guilds.isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
        <swr.Error response={guilds} />
        {guilds.data && (
          <div className="FlexContainer2">
            {guilds.data.map((e) => {
              if (e == null) return;
              return (
                <NextLink href={`/dashboard/${e.Id}`} key={e.Id}>
                  <Center>
                    <div
                      key={e.Id}
                      className={`ActiveCard card px-8 py-4 Guild FlexItem2 ${
                        e.Name.length >= 18 ? "" : "SingleLineGuild"
                      }`}
                    >
                      <Center>
                        <img
                          src={e.IconURL || ""}
                          className="w-8 rounded-full mb-2"
                        />
                      </Center>
                      <Center>
                        <span className="text-center font-semibold text-lg">
                          {e.Name.length >= 18
                            ? e.Name.substring(0, 16) + "..."
                            : e.Name}
                        </span>
                        {/* <ExternalIcon /> */}
                      </Center>
                    </div>
                  </Center>
                </NextLink>
              );
            })}
            <Center>
              <a href={props.inviteURL}>
                <div className="ActiveCard card px-8 py-4 Guild FlexItem2">
                  <Center>
                    <div className="mb-2 pt-[0.6rem]">
                      <AddIcon className="w-10 h-10 px-1 py-1" />
                    </div>
                  </Center>
                  <Center>
                    <span className="text-center font-semibold text-lg">
                      Add a server
                    </span>
                    {/* <ExternalIcon /> */}
                  </Center>
                </div>
              </a>
            </Center>
          </div>
        )}
      </AutoCenter>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> =
  async function (ctx) {
    return {
      props: {
        inviteURL: GenerateInviteURL(true),
        mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        apiUri: config.apiUri,
        privateKey: config.apiToken,
      },
    };
  };
