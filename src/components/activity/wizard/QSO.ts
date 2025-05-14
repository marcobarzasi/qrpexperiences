import {useToast} from "vue-toastification";
import {reactive, ref} from "vue";
import {checkRequiredField} from "../../utils.ts";
import {i18n} from "../../translations.ts";
import {resolveLocatorCall} from "../../locatorResolver.ts";
import {messages} from "../../messages.ts";


export interface ExternalEmitters {
    emit: any,
}

export interface ExternalModel {
    qso: any,
}


export const useSharedLogicQSO = (externalEmitters: ExternalEmitters, externalModels: ExternalModel) => {


    const toast = useToast();
    const bands = ref([
        {label: "---", value: ""},
        {label: "160m", value: "160M"},
        {label: "80m", value: "80M"},
        {label: "60m", value: "60M"},
        {label: "40m", value: "40M"},
        {label: "30m", value: "30M"},
        {label: "20m", value: "20M"},
        {label: "17m", value: "17M"},
        {label: "15m", value: "15M"},
        {label: "12m", value: "12M"},
        {label: "10m", value: "10M"},
        {label: "6m", value: "6M"},
        {label: "2m", value: "2M"},
        {label: "70cm", value: "70CM"},
        {label: "23cm", value: "23CM"},
        {label: "13cm", value: "13CM"},
    ]);

    const modes = ref([
        {label: "---", value: ""},
        {label: "SSB", value: "SSB"},
        {label: "CW", value: "CW"},
        {label: "FM", value: "FM"},
        {label: "AM", value: "AM"},
        {label: "DMR", value: "DIGITALVOICE"},
        {label: "FT8", value: "FT8"},
        {label: "C4FM", value: "C4FM"},
        {label: "DSTAR", value: "DSTAR"},
        {label: "MFSK", value: "MFSK"},
        {label: "PSK", value: "PSK"},
        {label: "RTTY", value: "RTTY"},

    ]);
    const fieldsStatus = reactive({
        call: {error: "", status: "NONE"},
        data: {error: "", status: "NONE"},
        time: {error: "", status: "NONE"},
        wwl: {error: "", status: "NONE"},
        ref: {error: "", status: "NONE"},
        banda_m: {error: "", status: "NONE"},
        modo: {error: "", status: "NONE"},
    })

    const state = reactive({
        searchWWL: false,
        message: "",
        messageId: 0,
    })

    const validateData = () => {
        return checkRequiredField(externalModels.qso.value.data, fieldsStatus.data);
    }

    const validateTime = () => {
        return checkRequiredField(externalModels.qso.value.time, fieldsStatus.time);
    }

    const validateCall = (resolveWWL = true) => {
        let result = checkRequiredField(externalModels.qso.value.call, fieldsStatus.call);
        if (result && !(/\d*[a-zA-Z]{1,}\d+[a-zA-Z]{1,}/.test(externalModels.qso.value.call))) {
            fieldsStatus.call.error = i18n.global.t("callErrato")
            fieldsStatus.call.status = "INVALID";
            result = false;
        } else {
            if (resolveWWL) {
                externalModels.qso.value.call = externalModels.qso.value.call.toUpperCase()
                state.searchWWL = true;
                resolveLocatorCall(externalModels.qso.value.call, (wwl: string) => {
                    state.searchWWL = false;
                    if (externalModels.qso.value.wwl != "" && externalModels.qso.value.wwl != wwl) {
                        messages.confirm(i18n.global.t("SostituireLocatore", {wwl1: externalModels.qso.value.wwl, wwl2: wwl}), () => {
                            externalModels.qso.value.wwl = wwl.toUpperCase();
                        })
                    } else {
                        externalModels.qso.value.wwl = wwl.toUpperCase();
                        ;
                    }
                })
            }
        }
        return result;

    }

    const validateMode = () => {
        return checkRequiredField(externalModels.qso.value.modo, fieldsStatus.modo);
    }

    const validateBand = () => {
        return checkRequiredField(externalModels.qso.value.banda_m, fieldsStatus.banda_m);
    }

    const validateWWL = () => {
        externalModels.qso.value.wwl = externalModels.qso.value.wwl.toUpperCase()
        return true;
    }


    const addQSO = () => {
        let result = true;
        result = validateData() && result;
        result = validateTime() && result;
        result = validateCall(false) && result;
        result = validateWWL() && result;
        result = validateMode() && result;
        result = validateBand() && result;

        if (!result) {
            messages.showMessage('warning', i18n.global.t("Ci sono dei campi mancanti o non corretti"));
            return;

        }

        externalEmitters.emit('update:new', JSON.parse(JSON.stringify(externalModels.qso.value)));
        externalModels.qso.value.call = "";
        externalModels.qso.value.time = "";
        externalModels.qso.value.rst_send = "";
        externalModels.qso.value.rst_rcvd = "";
        externalModels.qso.value.wwl = "";
        externalModels.qso.value.ref = "";
        resetStatus();


        toast.info(i18n.global.t("QSO aggiunto"));
        //state.message = "QSO aggiunto.";
        //state.messageId++;

    }

    const closeQSO = () => {
        externalEmitters.emit('update:close', null);
        $('#dettaglio_qso').modal('hide');
        resetStatus();
    }

    const resetStatus = () => {
        fieldsStatus.call.error = "";
        fieldsStatus.call.status = "NONE";
        fieldsStatus.data.error = "";
        fieldsStatus.data.status = "NONE";
        fieldsStatus.time.error = "";
        fieldsStatus.time.status = "NONE";
        fieldsStatus.wwl.error = "";
        fieldsStatus.wwl.status = "NONE";
        fieldsStatus.ref.error = "";
        fieldsStatus.ref.status = "NONE";

    }

    return {
        state,
        bands,
        modes,
        fieldsStatus,
        addQSO,
        closeQSO,
        resetStatus,
        validateData,
        validateTime,
        validateCall,
        validateBand,
        validateMode,
        validateWWL,


    };
}