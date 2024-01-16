//import React, { Component } from 'react';
import React, { PropsWithChildren, useState } from 'react';
//import Faq from 'react-faq-component';
import { Image } from '../Image';
import { Box, Center } from '@chakra-ui/react';
import { motion, useAnimation } from "framer-motion";

export interface Row {
    title: string;
    content: string;
}

export interface Data {
    title: string;
    rows: Row[];
}

export function FaqItem({ title, children, id }: {
    title: string;
    children: React.ReactNode;
    id?: string;
}) {
    const [isOpen, setOpen] = useState(false);
    const controls = useAnimation();

    const toggleFAQ = async () => {
        setOpen(!isOpen);
        await controls.start(isOpen ? { height: 0 } : { height: 'auto' });
    };

    return (
        <motion.div
            layout
            className='card px -5 py -4 max-w-[30rem] min-w-[25rem] overflow-hidden'
            transition={{ duration: 0.15, ease: 'easeInOut' }}
        >
            <motion.div
                layout
                className='cursor-pointer px-5 py-5 hover:bg -[#212225]'
                onClick={toggleFAQ}
            >
                <motion.h1 layoutId={id} className='inline'>
                    {title}
                </motion.h1>
                <motion.img
                    layout
                    src={isOpen ? '/Icons/Up.svg' : '/Icons/Down.svg'}
                    alt='Down'
                    width={20}
                    className='inline float-right mr-5'
                />
            </motion.div>
            <motion.hr
                //layout
                animate={controls}
                initial={{ height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`!max-w-[30rem] !min-w-[25rem] !w- [5000rem] flex-1`}
                hidden={!isOpen}
            />
            <Center>
                <motion.div
                    animate={controls}
                    initial={{ height: 0 }}
                    className={`py-6 max-w-md text-center`}
                    hidden={!isOpen}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                    {children}
                </motion.div>
            </Center>
        </motion.div>
    );
}

export function FAQ(data: PropsWithChildren) {
    return (
        <Box>
            {data.children}
        </Box>
    );
}
