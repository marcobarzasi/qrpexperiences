import {reactive} from "vue";
import {messages} from "../../messages.ts";
import {BO_qso} from "../../BO/BO_qso.ts";
import {getDistanceInKm, gridSquareToLatLon} from "../../utils.ts";
import {i18n} from "../../translations.ts";
import {resolveLocators} from "../../locatorResolver.ts";


export interface ExternalRef {
    gridQSO: any
    mapQSO: any,
}


export interface ExternalModel {
    attivazione: any,
    qso: any,
}


export const useSharedLogicLogbook = (externalRef: ExternalRef, externalModels: ExternalModel) => {


    const state = reactive({
        attivazione: externalModels.attivazione,
        dupe: 0,
        wrongWWL: 0,
        wrongCall: 0,
        qsoParks: 0,
        wwlSearch: false,
        //qso: qso.value,

    })

    const onUpload = (event: any) => {
        //let json = JSON.stringify(event.xhr.responseText);
        let json = event.xhr.responseText.replaceAll("\"true\"", "true");
        json = json.replaceAll("\"false\"", "false");
        let data = JSON.parse(json);

        if (data.success) {
            externalModels.qso.value = data.result.qso;
            externalModels.attivazione.value.data = data.result.info.date;
            externalModels.attivazione.value.locatore = data.result.info.wwl;
            setTimeout(resolveAllLocators, 1000);
        } else {
            messages.showError(data.error);
        }
    }

    const onUploadError = (event: any) => {
        messages.showError(event.error);
    }

    const checkQSO = () => {
        let listDupe = [] as string[];
        state.attivazione.isQRP = true;

        externalModels.qso.value.forEach((item: BO_qso) => {

            //Check Call
            if (item.call != "" && !(/[a-zA-Z]+\d+[a-zA-Z]+/.test((item.call)))) {
                item.wrongCall = true;
                state.wrongCall++;
            } else {
                item.wrongCall = false;
            }

            //Check DUPE
            var dupeKey = item.data + item.call + item.wwl + item.modo + item.banda_m + item.ref;
            if (listDupe.indexOf(dupeKey.toUpperCase()) > -1) {
                item.dupe = true;
                state.dupe++;
            } else {
                listDupe.push(dupeKey.toUpperCase());
                item.dupe = false;
            }

            if (item.wwl != "" && !(/[A-Z][A-Z][0-9][0-9][A-Z][A-Z]/.test((item.wwl)))) {
                item.wrongWWL = true;
            } else if (item.wwl == "JN62KS" || item.wwl == "AA00AA") {
                item.wrongWWL = true;
            } else {
                item.wrongWWL = false;
            }

            //check QRB
            let dist = 0
            if (state.attivazione.latitudine != 0 && state.attivazione.longitudine != 0 && item.wwl != "" && !item.wrongWWL) {
                let coord = gridSquareToLatLon(item.wwl)
                dist = getDistanceInKm(state.attivazione.latitudine, state.attivazione.longitudine, coord[1], coord[0]);
                if (dist == 0) {
                    dist = 1;
                }
            }
            item.km = dist;

            if (item.modo == 'SSB' && item.power > 10) {
                state.attivazione.isQRP = false;
            } else if (item.modo == 'CW' && item.power > 5) {
                state.attivazione.isQRP = false;
            } else if (item.power == 0) {
                state.attivazione.isQRP = false;
            }

            if (item.wrongWWL) {
                state.wrongWWL++;
                item.km = 0;
                dist = 0;
            }
        });
        fillQSO();
    }


    const fillQSO = () => {
        if (externalRef.mapQSO.value) {
            externalRef.mapQSO.value.clearMap();
            externalModels.qso.value.forEach((qso: any) => {
                externalRef.mapQSO.value.addQSO(qso);
            });
            externalRef.mapQSO.value.setHome(state.attivazione.latitudine, state.attivazione.longitudine);
        }
    }

    const reloadMap = () => {
        if (externalRef.mapQSO.value) {
            externalRef.mapQSO.value.reload();
            externalRef.mapQSO.value.fitMapToBounds();
        }
    }

    const resetForm = () => {
        externalRef.gridQSO.value.newQSO();
    }

    const deleteAllQSO = () => {
        messages.confirm(i18n.global.t("Sei sicuro di voler cancellare tutti i QSO?"), () => {
            externalModels.qso.value = [];
        });
    }

    const setPower = () => {
        const p = prompt(i18n.global.t("Inserisci la potenza in Watt"), "");
        if (p != null) {
            externalModels.qso.value.forEach((item: any) => {
                item.power = p;
            });
        }
    }

    const resolveAllLocators = () => {
        state.wwlSearch = true;
        resolveLocators(externalModels.qso.value, () => {
            state.wwlSearch = false;
            checkQSO();
        });
    }


    const validation = () => {
        checkQSO();
        return externalModels.qso.value.length > 0;
    }

    return {
        state,
        onUpload,
        onUploadError,
        checkQSO,
        fillQSO,
        reloadMap,
        resetForm,
        deleteAllQSO,
        setPower,
        resolveAllLocators,
        validation


    };
}