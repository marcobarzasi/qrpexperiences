import Swal, {SweetAlertIcon} from "sweetalert2";
import {i18n} from "./translations.ts";

function showLoadMessage() {
    if ($('#loader').length) {
        $('#loader').css('visibility', 'visible');
    }
}

function hideLoadMessage() {
    if ($('#loader').length) {
        $('#loader').css('visibility', 'hidden');
    }
}

function showError(text: string, callback: any = undefined) {


    Swal.fire({
        icon: 'error',
        title: i18n.global.t('SiVerificatoUnErrore'),
        html: "<small>" + text + "</small>",
    }).then(() => {
        if (callback) {
            callback();
        }
    })
}

function showMessage(type: SweetAlertIcon, text: string, callback: any = undefined) {
    Swal.fire({
        icon: type,
        html: text
    }).then(() => {
        if (callback) {
            callback();
        }
    })
}

function showSaveMessage() {
    $('#saving').modal('show');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, 500);
    });
}

function hideSaveMessage() {
    $('#saving').modal('hide');
}

function confirm(text: string, success: any, reject?: any) {

    Swal.fire({
        title: i18n.global.t('Conferma'),
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: i18n.global.t('SI'),
        cancelButtonText: i18n.global.t('NO')
    }).then((result) => {
        if (result.isConfirmed) {
            success();
        } else if (result.dismiss && result.isDismissed && reject) {
            reject();
        }
    })
}


export const messages = {
    showLoadMessage,
    hideLoadMessage,
    showSaveMessage,
    hideSaveMessage,
    showMessage,
    showError,
    confirm
}
