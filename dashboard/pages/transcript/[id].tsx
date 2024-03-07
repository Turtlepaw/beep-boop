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
            .map((message) => {
              const date = new Date(message.Date);
              //[["STARTING_MESSAGE",{"Components":[{"label":"Close Ticket","style":4},{"label":"Claim Ticket","style":3}],"User":{"Avatar":"https://cdn.discordapp.com/avatars/1028790472879128676/902c86b8a30461ca366f7163e925f5e8.webp?size=4096","Bot":true,"Tag":"Beep Boop Development#0106","Username":"Beep Boop Development"},"Embeds":[{"color":16736350,"title":"Ticket","author":{"name":"Created By Turtlepaw","icon_url":"https://cdn.discordapp.com/avatars/820465204411236362/aa4ece5f0f241fad5e3e554e5ef63887.webp"},"fields":[{"name":"Created At","value":"<t:1675363787:R>","inline":true},{"name":"Created By","value":"<@820465204411236362>","inline":true},{"name":"Reason","value":"No reason provided","inline":true},{"name":"Claimed By","value":"No one has claimed this ticket yet","inline":true}]}]}],["1070778229369077810",{"Content":"You can use ticket transcripts to look through tickets that have been closed","Date":"Thu Feb 02 2023 13:50:23 GMT-0500 (Eastern Standard Time)","Embeds":[],"Id":"1070778229369077810","User":{"Avatar":"https://cdn.discordapp.com/avatars/820465204411236362/aa4ece5f0f241fad5e3e554e5ef63887.png?size=4096","Tag":"Turtlepaw#3806","Username":"Turtlepaw","Bot":false},"Components":[]}],["1070778237141123113",{"Content":"","Date":"Thu Feb 02 2023 13:50:25 GMT-0500 (Eastern Standard Time)","Embeds":[{"type":"rich","title":"<:Flag:1043584066068422747> Add a Reason","description":"Would you like to add a reason to this?","color":5793266}],"Id":"1070778237141123113","User":{"Avatar":"https://cdn.discordapp.com/avatars/1028790472879128676/902c86b8a30461ca366f7163e925f5e8.png?size=4096","Tag":"Beep Boop Development#0106","Username":"Beep Boop Development","Bot":true},"Components":[]}]]
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
                        <span className="inline-block font-semibold">
                          {message.User.Username}
                        </span>
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
                          {isToday(message.Date)
                            ? "Today at"
                            : `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`}{" "}
                          {date
                            .toLocaleTimeString("us", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            .slice()}
                        </span>
                      </div>
                      <div>
                        {message.Content}
                        {message.Embeds?.length > 0 &&
                          message.Embeds.map((embed) => (
                            <div
                              key={embed.title}
                              className="pl-4 rounded-sm mt-1 py-2 border-l-4 border-l-[#5865f2] bg-[#2F3136]"
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
