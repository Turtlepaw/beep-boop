import { Box, Center, Text, Tooltip } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { AutoCenter } from "../../components/Layout/AutoCenter";
import { TicketData, Transcript } from "../../utils/api";
import { DefaultProps, Errors, parseUser } from "../../utils/parse-user";
import { Meta } from "../../components/Meta";
import { Image } from "../../components/Image";
import { NotLoggedIn } from "../../components/User";
import { ApiTicket, TicketMessage } from "../../utils/api-types";
import { Menu } from "../../components/Layout/Menu";
import { Markdown } from "../../components/Discord/Markdown";
import { useSession } from "next-auth/react";

export interface Props {
  error?: Errors;
  messages: TicketMessage[];
  ticket: ApiTicket;
}

export function Title({ children }: { children: string }) {
  return <h2 className="font-semibold text-lg uppercase">{children}</h2>;
}

function isToday(_date: any) {
  const today = new Date();
  const date = new Date(_date);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatTimestamp(inputString: string): string {
  const regex = /<t:(\d+):R>/g;
  //@ts-expect-error
  return inputString.replace(regex, (_, timestamp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = currentTime - parseInt(timestamp, 10);

    let formattedTimestamp = "";
    if (timeDifference < 60) {
      formattedTimestamp = "1 minute ago";
    } else if (timeDifference < 3600) {
      const minutes = Math.floor(timeDifference / 60);
      formattedTimestamp = `${minutes} minutes ago`;
    } else if (timeDifference < 86400) {
      const hours = Math.floor(timeDifference / 3600);
      formattedTimestamp = `${hours} hours ago`;
    } else {
      const days = Math.floor(timeDifference / 86400);
      formattedTimestamp = `${days} days ago`;
    }

    return (
      <span style={{ backgroundColor: "white" }}>{formattedTimestamp}</span>
    );
  });
}

function isTimestampString(str: string): boolean {
  const regex = /^<t:\d+:\w+>$/;
  return regex.test(str);
}

export default function Home(props: Props) {
  const { data, status } = useSession();
  const { messages, ticket } = props;

  function GetUser(id: string) {
    const messageUser = messages.find((e) => e.User.Id == id);
    if (ticket.Creator.Id == id) return ticket.Creator.Username;
    else if (messageUser != null) return messageUser.User.Username;
    else return id;
  }

  // if (status != "authenticated") return <NotLoggedIn />;
  if (messages == null)
    return (
      <>
        <Menu isDashboard />
        <Meta>Ticket Not Found</Meta>
        <div className="pb-20 pt-10">
          <Center>
            <Image
              className="mr-2 !w-[3.6rem] !h-[3.6rem] inline"
              loading="eager"
              src="https://raw.githubusercontent.com/Turtlepaw/fluent-emojis/master/Emojis/Travel%20and%20places/Flying%20Saucer.png"
              alt="Magic Wand"
              width={200}
            />
            <h1 className="font-bold text-4xl pt-5 pb-1.5 max -w-[rem] text-center">
              That ticket transcript doesn't exist.
            </h1>
          </Center>
          <Center>
            <p className="text-light text-lg pt-1">
              Maybe in another realm or timeline.
            </p>
          </Center>
        </div>
      </>
    );

  return (
    <>
      <Menu isDashboard />
      <Meta>Ticket Transcript</Meta>
      <div className="py-10">
        <AutoCenter>
          <h1 className="text-2xl font-bold">
            <Image
              className="inline mr-1"
              loading="eager"
              src="/Icons/Channel.svg"
              width={40}
              alt="Channel Icon"
            />
            ticket-{ticket.Creator.Username.toLowerCase()}
          </h1>
          <p className="text-light">
            This is an archive of a ticket with {ticket.Creator.Username}
          </p>
        </AutoCenter>
        <div className="pt-5">
          {messages
            .filter((e) => e.Content != "")
            .sort((a, b) => {
              const dateA = new Date(a.Date);
              const dateB = new Date(b.Date);
              return dateA.getTime() - dateB.getTime();
            })
            .map((message) => {
              const date = new Date(message.Date);
              return (
                <div key={message.Id} className="hover:bg-[#232429] py-2 pb-5">
                  <div className="pl-10">
                    <Image
                      className="rounded-full inline-block"
                      src={message.User.Avatar}
                      width={50}
                      alt={`${message.User.Username}'s Avatar`}
                    />
                    <div className="inline-grid pl-5">
                      <div>
                        <Tooltip
                          hasArrow
                          className="inline-block"
                          label={
                            <Box className="pr-2" color={"white"}>
                              {message.User.Id}
                            </Box>
                          }
                          placement="top"
                          shouldWrapChildren
                          bg="#292b2f"
                          borderRadius={6}
                          padding="4px 2px 4px 12px"
                        >
                          <span
                            className="inline-block font-semibold"
                            style={{
                              color: message.User.Color ?? "white",
                              cursor: "pointer",
                            }}
                          >
                            {message.User.Username}
                          </span>
                        </Tooltip>
                        {message.User.Bot && (
                          <Box
                            backgroundColor="#5865f2"
                            display="inline-block"
                            width={
                              message.User.Username.startsWith("Beep Boop")
                                ? 12
                                : 9
                            }
                            borderRadius={3}
                            marginLeft={2}
                          >
                            <Center>
                              {message.User.Username.startsWith(
                                "Beep Boop"
                              ) && (
                                <Tooltip
                                  hasArrow
                                  label={<Box>Verified Bot</Box>}
                                  placement="top"
                                  shouldWrapChildren
                                  bg="#18191c"
                                  borderRadius={6}
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 16 15.2"
                                  >
                                    <path
                                      d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                </Tooltip>
                              )}
                              <Text fontWeight="semibold" fontSize={11}>
                                BOT
                              </Text>
                            </Center>
                          </Box>
                        )}
                        <span
                          className="pl-2 text-light"
                          suppressHydrationWarning
                        >
                          <Tooltip
                            hasArrow
                            className="inline-block"
                            label={
                              <Box className="pr-2" color={"white"}>
                                {date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                                ,{" "}
                                {date.toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </Box>
                            }
                            placement="top"
                            shouldWrapChildren
                            bg="#292b2f"
                            borderRadius={6}
                            padding="4px 2px 4px 12px"
                          >
                            <Text className="text-light" cursor={"default"}>
                              {isToday(message.Date)
                                ? "Today at"
                                : `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`}{" "}
                              {date
                                .toLocaleTimeString("us", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                .slice()}
                              {message?.isEdit && " • Edited"}
                              {message?.Deleted && " • Deleted"}
                            </Text>
                          </Tooltip>
                        </span>
                      </div>
                      <div>
                        {message.Content?.length > 0 && (
                          <Markdown getUser={GetUser}>
                            {message.Content}
                          </Markdown>
                        )}
                        {message.Embeds?.length > 0 &&
                          message.Embeds.map((embed) => (
                            <div
                              key={embed.title}
                              className="pl-4 pr-4 rounded-md mt-1 py-2 border-l-[5px] border-l-[#5865f2] bg-[#2F3136]"
                            >
                              <h1 className="font-bold text-lg pb-2">
                                {embed.title}
                              </h1>
                              {embed.fields.map((field) => (
                                <div
                                  key={field.name}
                                  className={`${field.inline && "inline"}`}
                                >
                                  <h2 className="font-semibold">
                                    {field.name}
                                  </h2>
                                  <Markdown getUser={GetUser}>
                                    {field.value}
                                  </Markdown>
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
  ctx
) {
  const messages = await Transcript(
    Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id
  );

  if (messages.isError()) {
    return {
      props: {
        error: Errors.NotFound,
        messages: null,
        ticket: null,
      },
    };
  }

  const ticket = await TicketData(
    Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id
  );
  return {
    props: {
      ticket: ticket.fullResult,
      messages: messages.fullResult,
    },
  };
};
