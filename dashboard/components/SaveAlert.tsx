import { Button, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type Next = () => void;
export interface SaveProps {
    Save: (next: Next) => void;
    isOpen: boolean;
    setOpen: (value: boolean) => void;
}

export function CreateSaveOptions() {
    return useState(false);
}

export function useSave(Save: (next: Next) => any, next: Next) {
    if (window != null) next();
    Save(next);
};

export function SaveAlert({ Save, setOpen: SetPanel, isOpen: SavePanel }: SaveProps) {
    const [IsSaving, SetSaving] = useState(false);
    const TogglePanel = () => SetPanel(!SavePanel);
    const Next = () => {
        SetSaving(false);
        SetPanel(false);
    };
    const HandleSave = () => {
        SetSaving(true);
        setTimeout(() => {
            useSave(Save, Next)
        }, 500)
    }

    return (
        <div className={`${!SavePanel && "hidden"} ease-in-out ${SavePanel == false ? "popdown" : "popup"} z-50 fixed bottom-10 right-0 w-full flex flex-row flex-nowrap justify-center items-center`}>
            <div className='bg-[#131313] p-5 rounded-[8px]'>
                You have unsaved changes
                {/*ADD ANIMATIONS*/}
                <div className='inline pl-10'>
                    <Button variant="primary" onClick={HandleSave} className='mr-2 w-20'>
                        {
                            IsSaving ? (
                                <Center>
                                    <span className="loader mb-[1.6rem]"></span>
                                </Center>
                            ) : "Save"
                        }
                    </Button>
                    <Button variant="secondary" onClick={TogglePanel}>Close</Button>
                </div>
            </div>
        </div>
    );
}