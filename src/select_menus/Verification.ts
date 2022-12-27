import { Modules } from "../commands/Server";
import { ConfigurationBuilder } from "../utils/Configure";

export default new ConfigurationBuilder({
    Buttons: [

    ],
    Module: Modules.Verification,
    Save: () => {

    }
}).toJSON();