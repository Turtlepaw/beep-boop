import { Box, BoxProps, Center } from "@chakra-ui/react";
import { CSSProperties, useState } from "react";

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const booleans = [true, false];

//Default length is 5 (e.g. 40814)

export function randomNumber() {
  const n = Math.floor(Math.random() * Math.floor(numbers.length - 1)) + 1;

  return numbers[n];
}

export function generateId() {
  return `${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
}

export function randomBoolean() {
  const n = Math.floor(Math.random() * Math.floor(booleans.length - 1)) + 1;

  return booleans[n];
}

export function randomLetter() {
  const n = Math.floor(Math.random() * Math.floor(letters.length - 1)) + 1;

  return letters[n];
}

export function generatePassword(width: number = 10) {
  let password = "";
  for (let i = 0; i < width; i++) {
    let shouldBeRandomNumber = randomBoolean();
    let shouldBeUpperCase = randomBoolean();
    if (shouldBeRandomNumber) {
      password += randomNumber();
    } else {
      if (shouldBeUpperCase) {
        password += randomLetter.toString().toUpperCase();
      } else {
        password += randomLetter;
      }
    }
  }
  return password;
}

/**
 * Handy util for centering all children components
 */
export function AutoCenter(
  props: {
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
    centerAllWithAutoCenter?: boolean;
  } & BoxProps
) {
  const { children, className, style, centerAllWithAutoCenter } = props;
  if (Array.isArray(children)) {
    return (
      <Box className={`${className}`} style={style} {...props}>
        {children.map((child, index) => {
          const ParentComponent = centerAllWithAutoCenter ? AutoCenter : Center;
          return <ParentComponent key={index}>{child}</ParentComponent>;
        })}
      </Box>
    );
  } else {
    return (
      <Center className={`${className} py-5`} style={style} {...props}>
        {children}
      </Center>
    );
  }
}
