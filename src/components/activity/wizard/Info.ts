import {reactive, watch} from "vue";
import {checkRequiredField, gridSquareToLatLon, latLonToGridSquare} from "../../utils.ts";
import {i18n} from "../../translations.ts";
import {messages} from "../../messages.ts";


export interface ExternalRef {
    mapPos: any,
}

export interface ExternalEmitters {
    emit: any,
}

export interface ExternalModel {
    attivazione: any,
}


export const useSharedLogicInfo = (externalRef: ExternalRef, externalEmitters: ExternalEmitters, externalModels: ExternalModel) => {

    const state = reactive({
        att: externalModels.attivazione,
    })

    const fieldsStatus = reactive({
        call: {error: "", status: "NONE"},
        operatore: {error: "", status: "NONE"},
        data: {error: "", status: "NONE"},
        email: {error: "", status: "NONE"},
        nome: {error: "", status: "NONE"},
        latitudine: {error: "", status: "NONE"},
        longitudine: {error: "", status: "NONE"},
        locatore: {error: "", status: "NONE"},
    });


    const validation = (update: boolean): boolean => {
        let result = true;
        result &&= validateCall();
        result &&= validateOperatore();
        result &&= validateData();
        result &&= validateEMail();
        result &&= validateLatitudine();
        result &&= validateLongitudine();
        result &&= validatelocatore(update);
        return result;
    }

    const validateCall = (): boolean => {
        let result = checkRequiredField(state.att.call, fieldsStatus.call);
        if (result && !(/\d*[a-zA-Z]{1,}\d+[a-zA-Z]{1,}/.test(state.att.call))) {
            fieldsStatus.call.error = i18n.global.t("callErrato")
            fieldsStatus.call.status = "INVALID";
            messages.showError(i18n.global.t("callErrato"));
            result = false;
        } else if (!result) {
            messages.showError(i18n.global.t("Call obbligatorio"));
        }
        return result;

    }

    const validateOperatore = (): boolean => {
        if (!checkRequiredField(state.att.operatore, fieldsStatus.operatore)) {
            messages.showError(i18n.global.t("Operatore obbligatorio"));
            return false;
        }
        return true;
    }

    const validateData = (): boolean => {
        if (!checkRequiredField(state.att.data, fieldsStatus.data)) {
            messages.showError(i18n.global.t("Data obbligatoria"));
            return false;
        }
        return true;
    }

    const validateEMail = (): boolean => {
        if (!checkRequiredField(state.att.email, fieldsStatus.email)) {
            messages.showError(i18n.global.t("eMail obbligatoria"));
            return false;
        }
        return true;
    }


    const validateLatitudine = (): boolean => {
        let result = checkRequiredField(state.att.latitudine, fieldsStatus.latitudine);
        if (result) {
            calcPosition();
            externalEmitters.emit('check:logbook')
        } else {
            messages.showError(i18n.global.t("Latitudine obbligatoria"));
        }
        return result;
    }

    const validateLongitudine = (): boolean => {
        let result = checkRequiredField(state.att.longitudine, fieldsStatus.longitudine);
        if (result) {
            calcPosition();
            externalEmitters.emit('check:logbook')
        } else {
            messages.showError(i18n.global.t("Longitudine obbligatoria"));
        }
        return result;
    }

    const calcPosition = () => {
        if (state.att.latitudine != 0 && state.att.longitudine != 0) {
            state.att.locatore = latLonToGridSquare((state.att.latitudine), (state.att.longitudine)).toUpperCase();
            externalRef.mapPos.value.setPos((state.att.latitudine), (state.att.longitudine));
        }
    }

    const validatelocatore = (update: boolean): boolean => {
        let result = checkRequiredField(state.att.locatore, fieldsStatus.locatore);
        if (result) {
            if (update) {
                const coord = gridSquareToLatLon(state.att.locatore.toUpperCase());
                state.att.latitudine = coord[1];
                state.att.longitudine = coord[0];
            }
            externalRef.mapPos.value.centerToLocator(state.att.longitudine, state.att.latitudine)
            calcPosition();
            externalEmitters.emit('check:logbook')
        } else {
            messages.showError(i18n.global.t("Locatore obbligatorio"));
        }
        return result;
    }


    const setPositionFromMap = (data: any) => {
        state.att.latitudine = data.lat;
        state.att.longitudine = data.lng;
        state.att.altezza = data.alt;
        calcPosition();
        //state.att.locatore = latLonToGridSquare(state.att.latitudine, state.att.longitudine).toUpperCase();
        externalEmitters.emit('check:logbook')
    }

    const show = () => {
        externalRef.mapPos.value.reload();

        validatelocatore(false);
        validateData();
    }


    watch(() => state.att.latitudine, (newVal, oldVal) => {
        if (newVal != oldVal) {
            calcPosition();
        }
    })


    return {
        state,
        fieldsStatus,
        validation,
        validateCall,
        validateOperatore,
        validateData,
        validateEMail,
        validateLatitudine,
        validateLongitudine,
        calcPosition,
        validatelocatore,
        setPositionFromMap,
        show,

    };
}