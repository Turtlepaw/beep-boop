import React, { PropsWithChildren } from 'react'
import { HStack, Text, TextProps } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export default function ErrorMessage(props: TextProps) {
    const { children } = props;
    return (
        <HStack>
            {children && <AiFillExclamationCircle color='#ff7a6b' />}
            <Text color='#ff7a6b' {...props}>
                {children}
            </Text>
        </HStack>
    )
};