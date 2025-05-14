import {LogoPosition} from "./LogoPosition.ts";

export class BO_User {
    nome = "";
    cognome = "";
    email = "";
    role = "";
    call = "";
    image = "";
    bio = "";
    qsl_logo_position = LogoPosition.RIGHT;
    create_time = "";
    validated = true;
    changePassword = false;
    language = "it";
}