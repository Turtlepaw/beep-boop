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
import { NotLoggedIn } from "../../components/User";
import { Image } from "../../components/Image";
import { config } from "../../utils/config";
import { SWRManager } from "../../utils/swr";
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

export type PageProps = DefaultProps & { inviteURL: string } & ConfigProps;
export default function Home(props: PageProps) {
  if (props.user == null) return <NotLoggedIn {...props} />;
  const state = useState("");
  const swr = new SWRManager(props.privateKey, props.apiUri);
  function fetchData() {
    return swr.useFetch<APIGuild[]>({
      route: Routes.GuildsWith + `?id=${props.user.id}`,
    });
  }
  let guilds = fetchData();

  const Clipboard = useClipboard(guilds.error);
  const [expanded, expand] = useState(false);
  console.log(guilds.data);

  return (
    <div>
      <AutoCenter className="text-center" pb={5}>
        <Meta>Dashboard</Meta>
        <Menu user={props.user} isDashboard mobile={props.mobile} />
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
        {guilds.error && (
          <VStack pt={2}>
            <ErrorMessage>
              Something went wrong, try again in a few minutes.
            </ErrorMessage>
            <Box
              cursor="pointer"
              onClick={() => expand(!expanded)}
              className="hover:opacity-80"
            >
              {expanded ? "Less" : "More"} Details{" "}
              {expanded ? <UpIcon /> : <DownIcon />}
            </Box>
            {expanded && (
              <Box pb={5} pt={3}>
                <Code
                  p={5}
                  mx={20}
                  overflow="hidden"
                  backgroundColor="#2f3136"
                  textColor="white"
                  borderColor="#202225"
                  borderWidth={1.3}
                  borderRadius="md"
                  lang="js"
                >
                  {JSON.stringify(guilds.error)}
                  {/* {isCopied ?
                                    <CheckIcon color='#248045' /> :
                                    <CopyIcon color={Configuration.Color} onClick={() => {
                                        Clipboard.onCopy();
                                        setCopy(true);
                                    }} />
                                } */}
                </Code>
              </Box>
            )}
          </VStack>
        )}
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
    const user = await parseUser(ctx);
    return {
      props: {
        user,
        inviteURL: GenerateInviteURL(true),
        mobile: /mobile/i.test(ctx.req.headers["user-agent"] ?? ""),
        apiUri: config.apiUri,
        privateKey: config.apiToken,
      },
    };
  };
