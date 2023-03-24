import React, { PropsWithChildren } from 'react'
import { BoxProps, HStack, StackProps, Text, TextProps } from '@chakra-ui/react'
import { AiFillExclamationCircle } from 'react-icons/ai';

export default function ErrorMessage(props: TextProps & { _stack?: StackProps, _iconColor?: string }) {
    const { children } = props;
    return (
        <HStack {...props._stack}>
            {children && <AiFillExclamationCircle color={props._iconColor ?? '#ff7a6b'} />}
            <Text color='#ff7a6b' {...props}>
                {children}
            </Text>
        </HStack>
    )
};