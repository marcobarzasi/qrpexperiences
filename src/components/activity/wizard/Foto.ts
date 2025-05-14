import {reactive} from "vue";
import {BO_Images} from "../../BO/BO_Images.ts";
import {i18n} from "../../translations.ts";
import {messages} from "../../messages.ts";
import {server} from "../../server.ts";
import moment from "moment/moment";
import {useToast} from "vue-toastification";


export interface ExternalRef {

}

export interface ExternalEmitters {
    emit: any,
}

export interface ExternalModel {
    attivazione: any,
}


export const useSharedLogicFoto = (externalModels: ExternalModel) => {

    const toast = useToast();
    const state = reactive({
        att: externalModels.attivazione,
        images: [] as BO_Images[],
    })

    const fieldsStatus = {
        video: {error: "", status: "NONE"},
    }

    const getImagesSize = () => {
        let size = 0;
        state.images.forEach((image) => {
            size += image.size;
        });
        return size;
    }

    const validateVideo = () => {
        fieldsStatus.video.error = "";
        fieldsStatus.video.status = "NONE";
        if (state.att.video != "") {
            if (state.att.video.indexOf(" ") > -1) {
                fieldsStatus.video.error = i18n.global.t("Il link video non può contenere spazi");
                fieldsStatus.video.status = "INVALID";
                messages.showError(i18n.global.t("Il link video non può contenere spazi"));
                return false;
            }
            fieldsStatus.video.error = "";
            fieldsStatus.video.status = "VALID";
        }
        return true;
    }

    const validateFoto = (): boolean => {
        if ((50000000 - getImagesSize()) < 0) {
            messages.showError(i18n.global.t("Superato il limite di spazio per le immagini"));
            return false;
        }
        return true;
        //return true; //state.att.video != "" || state.images.length != 0;
    }


    const validation = (): boolean => {
        let result = true;
        result &&= validateVideo();
        result &&= validateFoto();
        return result;
    }

    const onUpload = (e: any) => {
        let r = true;
        e.xhr.responseText.split(",").forEach((result: string) => {
            if (result != "OK" && result != "") {
                toast.error('Errore: ' + result);
                r = false;
            }
        });

        if (r) {
            toast.success('File Uploaded');
        }

        reloadImages();
    };

    const reloadImages = () => {
        server.load('attivazioni.getImages', {uid: state.att.uid, year: moment(state.att.data).year()}, (data: any) => {
            state.images = data.result.list;
            if ((50000000 - getImagesSize()) < 0) {
                toast.error(i18n.global.t('Superato il limite di spazio per le immagini'));
            }
        });

    }

    const deleteImage = (image: BO_Images) => {
        server.save('attivazioni.deleteImage', {uid: state.att.uid, year: moment(state.att.data).year(), name: image.fileName}, (data: any) => {
            if (data.success) {
                reloadImages();
            } else {
                toast.error('Error:' + data.error);
            }
        });
    }


    return {
        state,
        fieldsStatus,
        validation,
        onUpload,
        reloadImages,
        deleteImage,
        getImagesSize,
        validateVideo,
    };
}