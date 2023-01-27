import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import Router from "next/router";
import { ChangeEvent, Dispatch, MouseEvent, MouseEventHandler, SetStateAction, useState } from "react";
import { AutoCenter } from "./AutoCenter";
import { ButtonStyle } from "../pages/_app";
import { Links } from "./Link";

export interface Key {
    Get: boolean;
    Set: Dispatch<SetStateAction<boolean>>;
}

export function GetKey(): Key {
    const [Get, Set] = useState<boolean>(false);
    return {
        Get,
        Set
    }
}

export function Experimental({ Get, Set }: Key) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    //const ToggleOpen = () => setOpen(!isOpen);
    const [Value, SetValue] = useState<string>();
    const Update = (target: ChangeEvent<HTMLInputElement>) => SetValue(target.target.value)
    return (
        <div className="pt-20 pb-28">
            <AutoCenter>
                <img src="/Beta.svg" className="w-20 rotate-12" />
                <h1 className="text-3xl font-bold pt-10">This feature's not out, yet.</h1>
                <p className="text-lg font-medium pt-2 max-w-2xl text-center">This feature is still experimental and may not work correctly, check our {Links.Discord} for updates about upcoming features and recent changes.</p>
                <a href="/dashboard/beta">
                    <Button className="mt-5" variant={ButtonStyle.BrandColor} onClick={onOpen}>
                        Continue Anyway
                    </Button>
                </a>
            </AutoCenter>
        </div>
    );
}