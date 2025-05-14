import {useToast} from "vue-toastification";
import {reactive, ref} from "vue";
import {BO_Activation} from "../../BO/BO_Activation.ts";
import {BO_qso} from "../../BO/BO_qso.ts";
import {messages} from "../../messages.ts";
import {i18n} from "../../translations.ts";
import {server} from "../../server.ts";
import {router} from "../../../routes.ts";
import {generateUID} from "../../utils.ts";

export interface Props {
    uid?: string;
}

export interface ExternalRef {
    logbook: any,
    foto: any,
    info: any,
    racconto: any,
    qsl: any,
}

export const useSharedLogicWizard = (props: Props, externalRef: ExternalRef) => {
    const toast = useToast();

    const state = reactive({
        attivazione: new BO_Activation(),
        qso: [] as BO_qso[],

        loaded: false,
        saved: false,
    })

    const active = ref(0);

    const save = () => {
        if (state.attivazione.data == "") {
            messages.showError(i18n.global.t("Per salvare devi indicare la data dell'attivazione."), () => {
                toast.error(i18n.global.t("Attivazione non salvata."));
            });

            return;
        }

        //if (state.attivazione.status == StatusAttivazione.PUBBLICA) {
        if (!checkPublic()) {
            return;
        }
        //}


        toast.info(i18n.global.t("Salvataggio in corso..."));
        server.save("attivazioni.save", {att: JSON.stringify(state.attivazione), qso: JSON.stringify(state.qso)}, (response: any) => {
            if (response.success) {
                state.saved = true;
                toast.clear();
                toast.success(i18n.global.t("Salvataggio avvenuto con successo"));
            } else {
                messages.showError(response.error);
            }
        });
    }


    const checkPublic = () => {
        let result = true;
        result = externalRef.info.value.validation(false) && result;
        result = externalRef.racconto.value.validation() && result;
        result = externalRef.foto.value.validation() && result;
        result = externalRef.logbook.value.validation() && result;

        if (!result) {
            /* messages.showError("Ci sono errori nei dati inseriti, correggi e riprova.", () => {
               toast.error("Attivazione non pubblicata.");
             });*/
            return false;
        }

        const checkDate = state.qso.some((item: BO_qso) => {
            return item.data == state.attivazione.data;
        });
        if (!checkDate) {
            messages.showError(i18n.global.t("La data dell'attivazione non corrisponde a nessun QSO inserito."), () => {
                toast.error(i18n.global.t("Attivazione non pubblicata."))
            });
            return false;
        }

        return true;

    }

    const init = () => {
        let data = {};
        server.load("user.getLogged", data, (response: any) => {
            if (response.success) {
                if (response.result.userInfo.call == '') {
                    router.push("/login");
                } else {
                    state.attivazione.call = response.result.userInfo.call;
                    state.attivazione.operatore = response.result.userInfo.call;
                    state.attivazione.email = response.result.userInfo.email;

                    const uid = props.uid || "";

                    if (uid != "") {
                        state.attivazione.uid = uid;
                        server.load("attivazioni.get", {uid: uid}, (response: any) => {
                            if (response.success) {
                                state.attivazione = response.result.attivazione;

                                state.qso = response.result.qso;

                                setTimeout(externalRef.foto.value.reloadImages, 1000);
                                setTimeout(externalRef.info.value.calcPosition, 1000);
                                setTimeout(externalRef.qsl.value.loadQSL, 1000);
                                setTimeout(externalRef.logbook.value.checkQSO, 1000);
                                //logbook.value.checkLogbook();
                                setTimeout(() => {
                                    state.loaded = true
                                }, 1000);
                                //state.loaded = true;
                                state.saved = true;
                            } else {
                                messages.showError(response.error);
                            }
                        })
                    } else {
                        state.attivazione.uid = generateUID();
                        state.loaded = true;
                        setTimeout(externalRef.qsl.value.loadQSL, 1000);
                    }
                }
            } else {
                router.push("/login");
            }
        })
    }
    init();

    const close = () => {
        router.push({name: 'activity', params: {uid: state.attivazione.uid}});
    }

    const checkLogbook = () => {
        externalRef.logbook.value.validation();
    }

    const infoShow = (callback: any) => {
        callback();
        setTimeout(externalRef.info.value.show, 100);
    }

    return {
        state,
        active,
        save,
        close,
        checkLogbook,
        infoShow,
    };
}