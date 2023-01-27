//import React, { Component } from 'react';
import React, { PropsWithChildren, useState } from 'react';
//import Faq from 'react-faq-component';
import { Image } from './Image';
import { Center } from '@chakra-ui/react';

export interface Row {
    title: string;
    content: string;
}

export interface Data {
    title: string;
    rows: Row[];
}

export function FaqItem(e: {
    title: string;
    children: React.ReactNode;
    id?: string;
}) {
    const [isOpen, setOpen] = useState(false);
    const HandleInteraction = () => setOpen(!isOpen);
    return (
        <div className='card px 5 py -4 max-w-[30rem] min-w-[30rem] overflow-hidden'>
            <div onClick={HandleInteraction} className="cursor-pointer px-5 py-5 hover:bg-[#212225]">
                <h1 className='inline' id={e.id ?? encodeURI(e.title)}>{e.title}</h1>
                <Image src={isOpen ? '/Icons/Up.svg' : '/Icons/Down.svg'} alt='Down' width={20} className="inline float-right mr-5" />
            </div>
            <hr className={`${isOpen ? "" : "hidden"} !w-[5000rem] flex-1 `} />
            <Center>
                <div className={`${isOpen ? "" : "hidden"} pt-3 pb-6 max-w-md text-center`}>
                    {e.children}
                </div>
            </Center>
        </div>
    );
}

export function FAQ(data: PropsWithChildren) {
    return (
        <div>
            {data.children}
        </div>
    );
}
