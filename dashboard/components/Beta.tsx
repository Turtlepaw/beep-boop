import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { AutoCenter } from "./AutoCenter";

export function Experimental() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    //const ToggleOpen = () => setOpen(!isOpen);
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
                            You're not allowed to bypass this.
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