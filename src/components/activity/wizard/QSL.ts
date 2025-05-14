import {reactive} from "vue";
import {BO_Images} from "../../BO/BO_Images.ts";
import {server} from "../../server.ts";
import moment from "moment/moment";
import {useStore} from "../../../store/Store.ts";


export interface ExternalRef {
    qslCard: any
}

export interface ExternalEmitters {
    emit: any,
}

export interface ExternalModel {
    attivazione: any,
}


export const useSharedLogicQSL = (externalRef: ExternalRef, externalModels: ExternalModel) => {
    const globalState = useStore();

    const state = reactive({
        qsl: [] as BO_Images[],
    });

    const loadQSL = () => {
        server.load('qsl.list', {call: globalState.user.call}, (data: any) => {
            state.qsl = data.result.list;
        });

    }

    const selectQSL = (image: BO_Images) => {
        server.load('qsl.select', {uid: externalModels.attivazione.value.uid, fileName: image.fileName, year: moment(externalModels.attivazione.value.data).year()}, () => {
            externalRef.qslCard.value.reload();
        });
    }


    return {
        state,
        loadQSL,
        selectQSL,

    };
}