import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import Router from "next/router";
import { ChangeEvent, Dispatch, MouseEvent, MouseEventHandler, SetStateAction, useState } from "react";
import { AutoCenter } from "./AutoCenter";

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
    const keys = [
        "35j5iuf89u14",
        "airdot_beta_2022"
    ];

    const { isOpen, onOpen, onClose } = useDisclosure();
    //const ToggleOpen = () => setOpen(!isOpen);
    const [Value, SetValue] = useState<string>();
    const Update = (target: ChangeEvent<HTMLInputElement>) => SetValue(target.target.value)
    const Verify = (target: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (!keys.includes(Value)) return;
        else {
            Set(true)
        }
    }
    return (
        <div className="pt-20 pb-28">
            <AutoCenter>
                <img src="/Beta.svg" className="w-20 rotate-12" />
                <h1 className="text-3xl font-bold pt-10">This feature's not out, yet.</h1>
                <p className="text-lg font-medium pt-2 max-w-2xl text-center">This feature is still experimental and may not work correctly, check our Discord for updates about upcoming features and recent changes.</p>
                <Button className="mt-5" variant="secondary" onClick={onOpen}>
                    Bypass
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent className="ModalBackground">
                        <ModalHeader>Developer Bypass</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <h1 className="font-bold uppercase text-lg">Key</h1>
                            <Input onChange={Update} className="mt-5 InputBuilder" placeholder="key_1234" type="password" _focus={{
                                borderColor: "#52565e"
                            }} />
                            <Button onClick={Verify}>Submit</Button>
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="danger" onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </AutoCenter>
        </div>
    );
}