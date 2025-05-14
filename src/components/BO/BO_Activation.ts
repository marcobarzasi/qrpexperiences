import {StatusAttivazione} from "./StatusAttivazione";

export class BO_Activation {
    uid = "";
    call = "";
    operatore = "";
    data = "";
    ref = "";
    nome = "";
    status = StatusAttivazione.PUBBLICA;
    locatore = "";
    descrizione = "";

    isQRP = false;

    latitudine = 0;
    longitudine = 0;
    altezza = 0;
    email = "";
    video = "";
    qsl_commento = "";
    qsl_send = "false";
    version = 0;
}