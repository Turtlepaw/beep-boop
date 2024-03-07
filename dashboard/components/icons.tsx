// 🤖 This is an automated function that generates emojis from servers
// 📝 Any edits made in this file will be overwritten
import Image, { ImageProps as NextImageProps } from "next/image";
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type ImageProps = Optional<NextImageProps, "alt" | "src"> & { size?: number; };

export const Icons = {
    /**
        ![Bot](https://cdn.discordapp.com/emojis/1040733154656403616.webp?size=1024&quality=lossless)
    */
    Bot: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1040733154656403616.webp?size=1024&quality=lossless" alt="Bot" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Book](https://cdn.discordapp.com/emojis/1043579932665708604.webp?size=1024)
    */
    Book: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579932665708604.webp?size=1024" alt="Book" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Clock](https://cdn.discordapp.com/emojis/1043579937690497044.webp?size=1024)
    */
    Clock: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579937690497044.webp?size=1024" alt="Clock" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Code](https://cdn.discordapp.com/emojis/1043579940903342201.webp?size=1024)
    */
    Code: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579940903342201.webp?size=1024" alt="Code" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Color](https://cdn.discordapp.com/emojis/1043579942811750410.webp?size=1024)
    */
    Color: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579942811750410.webp?size=1024" alt="Color" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![External](https://cdn.discordapp.com/emojis/1043579944254578768.webp?size=1024)
    */
    External: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579944254578768.webp?size=1024" alt="External" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Link](https://cdn.discordapp.com/emojis/1043579945777119242.webp?size=1024)
    */
    Link: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579945777119242.webp?size=1024" alt="Link" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![MemberAdd](https://cdn.discordapp.com/emojis/1043579947639386292.webp?size=1024)
    */
    MemberAdd: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579947639386292.webp?size=1024" alt="MemberAdd" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Refresh](https://cdn.discordapp.com/emojis/1043579950197903430.webp?size=1024)
    */
    Refresh: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579950197903430.webp?size=1024" alt="Refresh" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Trash](https://cdn.discordapp.com/emojis/1043579951586213888.webp?size=1024)
    */
    Trash: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043579951586213888.webp?size=1024" alt="Trash" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Brush](https://cdn.discordapp.com/emojis/1043584063358906558.webp?size=1024)
    */
    Brush: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043584063358906558.webp?size=1024" alt="Brush" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Channel](https://cdn.discordapp.com/emojis/1043584064751423608.webp?size=1024)
    */
    Channel: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043584064751423608.webp?size=1024" alt="Channel" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Flag](https://cdn.discordapp.com/emojis/1043584066068422747.webp?size=1024)
    */
    Flag: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043584066068422747.webp?size=1024" alt="Flag" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Mark](https://cdn.discordapp.com/emojis/1043584067418992670.webp?size=1024)
    */
    Mark: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043584067418992670.webp?size=1024" alt="Mark" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Badge](https://cdn.discordapp.com/emojis/1043599252414275634.webp?size=1024)
    */
    Badge: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043599252414275634.webp?size=1024" alt="Badge" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Globe](https://cdn.discordapp.com/emojis/1043599254125563925.webp?size=1024)
    */
    Globe: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043599254125563925.webp?size=1024" alt="Globe" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Emoji](https://cdn.discordapp.com/emojis/1043718870013325394.webp?size=1024)
    */
    Emoji: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043718870013325394.webp?size=1024" alt="Emoji" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Folder](https://cdn.discordapp.com/emojis/1043718871422615612.webp?size=1024)
    */
    Folder: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043718871422615612.webp?size=1024" alt="Folder" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Image](https://cdn.discordapp.com/emojis/1043718873045811271.webp?size=1024)
    */
    Image: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043718873045811271.webp?size=1024" alt="Image" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Voice](https://cdn.discordapp.com/emojis/1043733614589902878.webp?size=1024)
    */
    Voice: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043733614589902878.webp?size=1024" alt="Voice" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Members](https://cdn.discordapp.com/emojis/1044023938591756370.webp?size=1024)
    */
    Members: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044023938591756370.webp?size=1024" alt="Members" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Info](https://cdn.discordapp.com/emojis/1044457273990324264.webp?size=1024)
    */
    Info: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044457273990324264.webp?size=1024" alt="Info" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Shield](https://cdn.discordapp.com/emojis/1044472705845563442.webp?size=1024)
    */
    Shield: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044472705845563442.webp?size=1024" alt="Shield" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Lock](https://cdn.discordapp.com/emojis/1044474659749507082.webp?size=1024)
    */
    Lock: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044474659749507082.webp?size=1024" alt="Lock" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Unlock](https://cdn.discordapp.com/emojis/1044474661519495188.webp?size=1024)
    */
    Unlock: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044474661519495188.webp?size=1024" alt="Unlock" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Paint](https://cdn.discordapp.com/emojis/1046915159668572240.webp?size=1024)
    */
    Paint: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915159668572240.webp?size=1024" alt="Paint" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Zap](https://cdn.discordapp.com/emojis/1046915192191197214.webp?size=1024)
    */
    Zap: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915192191197214.webp?size=1024" alt="Zap" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Gift](https://cdn.discordapp.com/emojis/1046915229453406310.webp?size=1024)
    */
    Gift: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915229453406310.webp?size=1024" alt="Gift" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![ConfigureAdvanced](https://cdn.discordapp.com/emojis/1046915256225640600.webp?size=1024)
    */
    ConfigureAdvanced: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915256225640600.webp?size=1024" alt="ConfigureAdvanced" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Configure](https://cdn.discordapp.com/emojis/1046915276043726890.webp?size=1024)
    */
    Configure: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915276043726890.webp?size=1024" alt="Configure" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Discover](https://cdn.discordapp.com/emojis/1046915294624501821.webp?size=1024)
    */
    Discover: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1046915294624501821.webp?size=1024" alt="Discover" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![DefaultTrash](https://cdn.discordapp.com/emojis/1049878137917419631.webp?size=1024)
    */
    DefaultTrash: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049878137917419631.webp?size=1024" alt="DefaultTrash" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Tag](https://cdn.discordapp.com/emojis/1053881213112295505.webp?size=1024)
    */
    Tag: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1053881213112295505.webp?size=1024" alt="Tag" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Add](https://cdn.discordapp.com/emojis/1053887100551966771.webp?size=1024)
    */
    Add: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1053887100551966771.webp?size=1024" alt="Add" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![RoleAdd](https://cdn.discordapp.com/emojis/1053887102187741304.webp?size=1024)
    */
    RoleAdd: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1053887102187741304.webp?size=1024" alt="RoleAdd" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![RoleRemove](https://cdn.discordapp.com/emojis/1053887104842735677.webp?size=1024)
    */
    RoleRemove: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1053887104842735677.webp?size=1024" alt="RoleRemove" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Remove](https://cdn.discordapp.com/emojis/1053887107921363034.webp?size=1024)
    */
    Remove: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1053887107921363034.webp?size=1024" alt="Remove" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Success](https://cdn.discordapp.com/emojis/1054103410183524402.webp?size=1024)
    */
    Success: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1054103410183524402.webp?size=1024" alt="Success" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Error](https://cdn.discordapp.com/emojis/1054103452579549326.webp?size=1024)
    */
    Error: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1054103452579549326.webp?size=1024" alt="Error" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Advanced](https://cdn.discordapp.com/emojis/1061826562514751508.webp?size=1024)
    */
    Advanced: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061826562514751508.webp?size=1024" alt="Advanced" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Dark](https://cdn.discordapp.com/emojis/1061826566373527644.webp?size=1024)
    */
    Dark: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061826566373527644.webp?size=1024" alt="Dark" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Print](https://cdn.discordapp.com/emojis/1061826569800253441.webp?size=1024)
    */
    Print: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061826569800253441.webp?size=1024" alt="Print" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Star](https://cdn.discordapp.com/emojis/1061826573222826014.webp?size=1024)
    */
    Star: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061826573222826014.webp?size=1024" alt="Star" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Sync](https://cdn.discordapp.com/emojis/1061826576171421736.webp?size=1024)
    */
    Sync: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061826576171421736.webp?size=1024" alt="Sync" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Date](https://cdn.discordapp.com/emojis/1061841890384814081.webp?size=1024)
    */
    Date: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1061841890384814081.webp?size=1024" alt="Date" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Plane](https://cdn.discordapp.com/emojis/1065079776546660512.webp?size=1024)
    */
    Plane: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1065079776546660512.webp?size=1024" alt="Plane" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Member](https://cdn.discordapp.com/emojis/1065090193494904913.webp?size=1024)
    */
    Member: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1065090193494904913.webp?size=1024" alt="Member" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Quotes](https://cdn.discordapp.com/emojis/1066185365523792042.webp?size=1024)
    */
    Quotes: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1066185365523792042.webp?size=1024" alt="Quotes" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Search](https://cdn.discordapp.com/emojis/1066924460495622196.webp?size=1024)
    */
    Search: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1066924460495622196.webp?size=1024" alt="Search" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![AirdotTeam](https://cdn.discordapp.com/emojis/1079942878937239732.webp?size=1024)
    */
    AirdotTeam: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1079942878937239732.webp?size=1024" alt="AirdotTeam" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![ProUser](https://cdn.discordapp.com/emojis/1079942882519175208.webp?size=1024)
    */
    ProUser: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1079942882519175208.webp?size=1024" alt="ProUser" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Dot](https://cdn.discordapp.com/emojis/1043218649940508712.webp?size=1024)
    */
    Dot: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043218649940508712.webp?size=1024" alt="Dot" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Exit](https://cdn.discordapp.com/emojis/1043365197424885791.webp?size=1024)
    */
    Exit: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043365197424885791.webp?size=1024" alt="Exit" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Left](https://cdn.discordapp.com/emojis/1043368910432505976.webp?size=1024)
    */
    Left: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043368910432505976.webp?size=1024" alt="Left" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Right](https://cdn.discordapp.com/emojis/1043368953860329532.webp?size=1024)
    */
    Right: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043368953860329532.webp?size=1024" alt="Right" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Transparent](https://cdn.discordapp.com/emojis/1043420854379356210.webp?size=1024)
    */
    Transparent: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043420854379356210.webp?size=1024" alt="Transparent" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![close](https://cdn.discordapp.com/emojis/1043572422001037452.webp?size=1024)
    */
    Close: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043572422001037452.webp?size=1024" alt="close" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![checkmark](https://cdn.discordapp.com/emojis/1043572707360510072.webp?size=1024)
    */
    Checkmark: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043572707360510072.webp?size=1024" alt="checkmark" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![VerifiedBotText](https://cdn.discordapp.com/emojis/1043595399669231746.webp?size=1024)
    */
    VerifiedBotText: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043595399669231746.webp?size=1024" alt="VerifiedBotText" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![VerifiedBotCheck](https://cdn.discordapp.com/emojis/1043595400701022350.webp?size=1024)
    */
    VerifiedBotCheck: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043595400701022350.webp?size=1024" alt="VerifiedBotCheck" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Community](https://cdn.discordapp.com/emojis/1043716351447011338.webp?size=1024)
    */
    Community: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043716351447011338.webp?size=1024" alt="Community" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![bravery](https://cdn.discordapp.com/emojis/1043717218866823291.webp?size=1024)
    */
    Bravery: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043717218866823291.webp?size=1024" alt="bravery" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![brilliance](https://cdn.discordapp.com/emojis/1043717260499488879.webp?size=1024)
    */
    Brilliance: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043717260499488879.webp?size=1024" alt="brilliance" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![balance](https://cdn.discordapp.com/emojis/1043717302564171846.webp?size=1024)
    */
    Balance: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1043717302564171846.webp?size=1024" alt="balance" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![StatusOnline](https://cdn.discordapp.com/emojis/1044019293307801680.webp?size=1024)
    */
    StatusOnline: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044019293307801680.webp?size=1024" alt="StatusOnline" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![StatusOffline](https://cdn.discordapp.com/emojis/1044019373775540276.webp?size=1024)
    */
    StatusOffline: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044019373775540276.webp?size=1024" alt="StatusOffline" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![HelpCircle](https://cdn.discordapp.com/emojis/1044458637579518026.webp?size=1024)
    */
    HelpCircle: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1044458637579518026.webp?size=1024" alt="HelpCircle" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![ActiveDeveloper](https://cdn.discordapp.com/emojis/1049873261615382668.webp?size=1024)
    */
    ActiveDeveloper: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049873261615382668.webp?size=1024" alt="ActiveDeveloper" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![ServerOwner](https://cdn.discordapp.com/emojis/1049873748397936652.webp?size=1024)
    */
    ServerOwner: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049873748397936652.webp?size=1024" alt="ServerOwner" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Enabled](https://cdn.discordapp.com/emojis/1049904633939763211.webp?size=1024)
    */
    Enabled: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049904633939763211.webp?size=1024" alt="Enabled" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Disabled](https://cdn.discordapp.com/emojis/1049904650989600849.webp?size=1024)
    */
    Disabled: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049904650989600849.webp?size=1024" alt="Disabled" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![blank](https://cdn.discordapp.com/emojis/1049914365752651796.webp?size=1024)
    */
    Blank: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1049914365752651796.webp?size=1024" alt="blank" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![StemItem](https://cdn.discordapp.com/emojis/1051630581340971108.webp?size=1024)
    */
    StemItem: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1051630581340971108.webp?size=1024" alt="StemItem" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![StemEnd](https://cdn.discordapp.com/emojis/1051630676354551839.webp?size=1024)
    */
    StemEnd: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1051630676354551839.webp?size=1024" alt="StemEnd" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![emoji_46](https://cdn.discordapp.com/emojis/1054096080180097154.webp?size=1024)
    */
    Emoji46: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1054096080180097154.webp?size=1024" alt="emoji_46" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![emoji_47](https://cdn.discordapp.com/emojis/1054096101180985384.webp?size=1024)
    */
    Emoji47: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1054096101180985384.webp?size=1024" alt="emoji_47" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![emoji_48](https://cdn.discordapp.com/emojis/1054096119954673855.webp?size=1024)
    */
    Emoji48: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1054096119954673855.webp?size=1024" alt="emoji_48" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Statistics](https://cdn.discordapp.com/emojis/1067239843152793660.webp?size=1024)
    */
    Statistics: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1067239843152793660.webp?size=1024" alt="Statistics" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Clipboard](https://cdn.discordapp.com/emojis/1080303994343280701.webp?size=1024)
    */
    Clipboard: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1080303994343280701.webp?size=1024" alt="Clipboard" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![VerifiedLight](https://cdn.discordapp.com/emojis/1080647205423153184.webp?size=1024)
    */
    VerifiedLight: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1080647205423153184.webp?size=1024" alt="VerifiedLight" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![VerifiedGreen](https://cdn.discordapp.com/emojis/1080647224616308797.webp?size=1024)
    */
    VerifiedGreen: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1080647224616308797.webp?size=1024" alt="VerifiedGreen" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Broom](https://cdn.discordapp.com/emojis/1086651988739113031.webp?size=1024)
    */
    Broom: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1086651988739113031.webp?size=1024" alt="Broom" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />,
    /**
        ![Game](https://cdn.discordapp.com/emojis/1086652337273180251.webp?size=1024)
    */
    Game: (props?: ImageProps) => <Image src="https://cdn.discordapp.com/emojis/1086652337273180251.webp?size=1024" alt="Game" width={props?.size ?? props?.width} height={props?.size ?? props?.height} {...props} />
}