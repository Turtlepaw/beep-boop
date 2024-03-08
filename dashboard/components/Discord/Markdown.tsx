import { PropsWithChildren } from "react";
import { Mention } from "./Mention";
import { Box, Tooltip } from "@chakra-ui/react";

export interface MarkdownProperties {
  getUser: (id: string) => string;
  children: string;
}

function formatTimestamp(input: number): string {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeDifference = currentTime - input;
  if (timeDifference < 60) {
    return "1 minute ago";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(timeDifference / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

export function Markdown({ children, getUser }: MarkdownProperties) {
  const Mentions = children.split(" ");
  const newArray = [];
  const timestampRegex = /^<t:(\d+):\w+>$/gi;
  Mentions.map((mention) => {
    //if (!/\<@([0-9]{18,19})\>/gi.test(mention)) return ` ${mention} `;
    //if (!timestampRegex.test(mention)) return ` ${mention} `;
    if (timestampRegex.test(mention)) {
      const data = /^<t:(\d+):\w+>$/gi.exec(mention);
      console.log(data, mention);
      if (data === null || data.length <= 0) {
        newArray.push(<Mention>Unknown Timestamp</Mention>);
      } else {
        const unixTime = parseInt(data[1], 10);
        const timestamp = formatTimestamp(unixTime); // Access timestamp from data[1]
        const date = new Date(unixTime * 1000);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        newArray.push(
          <Tooltip
            hasArrow
            className="inline-block"
            label={
              <Box className="pr-2" color={"white"}>
                {formattedDate}, {formattedTime}
              </Box>
            }
            placement="top"
            shouldWrapChildren
            bg="#292b2f"
            borderRadius={6}
            padding="4px 2px 4px 12px"
          >
            <Box
              display="inline"
              bgColor={"#383a41"}
              paddingTop="0.2"
              paddingBottom="0.5"
              marginX={0.2}
              paddingX={1}
              borderRadius={4}
              cursor="pointer"
            >
              {timestamp}
            </Box>
          </Tooltip>
        );
      }
    } else if (/\<@([0-9]{18,19})\>/gi.test(mention)) {
      const Id = /\<@([0-9]{18,19})\>/gi.exec(mention)[1];
      const User = getUser(Id);
      return <Mention>@{User}</Mention>;
    } else return ` ${mention} `;
  }).forEach((e) => newArray.push(e));

  return <>{newArray}</>;
}
