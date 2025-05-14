import {messages} from "./messages.ts";
import {router} from "../routes.ts";
import {useStore} from '../store/Store.ts'
import {i18n} from "./translations.ts";


function openTicket(message: string, id?: string) {
    const globalState = useStore();
    const ticketUser = globalState.user.call;
    window.open("https://radioexperiences.net/ticket/index.php?a=add&category=3&custom1=" + ticketUser + "&custom2=" + (id || "") + "&name=" + ticketUser + "&custom3=" + encodeURIComponent(message), "_blank");

}

function load(service: string, data: any, success: any, error?: any) {

    messages.showLoadMessage();
    $.ajax({
        method: "GET",
        url: "/server/api/Api.php?service=" + service,
        data: {data: JSON.stringify(data)},
        dataType: "json",
        statusCode: {
            401: function () {
                router.push("/login");
                //location.href = "/login/";
            }
        }
    }).done(function (str: string) {
        let json = JSON.stringify(str);
        json = json.replaceAll("\"true\"", "true");
        json = json.replaceAll("\"false\"", "false");
        data = JSON.parse(json);

        if (data.result) {
            success(data);
        } else {
            if (error)
                error(data);
            messages.showError(data.error);
        }
    }).fail(function (response: any) {
        if (service != "app.ticket") {
            let user = useStore().user.call

            let message = "url: " + window.location.href + "<br>\n";
            message += "user: " + user + "<br>\n";
            message += +service + "<br>\n";
            message += JSON.stringify(data, null, 2) + "<br>\n";
            if (response.responseText) {
                message += response.responseText;
            } else {
                message += JSON.stringify(response);
            }
            load("app.ticket", {id: data.uid || '', message: message}, () => {
            });
        }
        messages.confirm(i18n.global.t("Si è verificato un errore, vuoi segnalarlo?"), () => {
            let message = JSON.stringify(data) + " | " + response.responseText;
            openTicket(message);
        });
    }).always(function () {
        messages.hideLoadMessage();
    });
}

function save(service: string, data: any, success: any) {

    /*    if (data.token === undefined) {
            addToken(service, data, success, null, save);
            return;
        }*/

    messages.showSaveMessage().then(() => {
        $.ajax({
            method: "POST",
            url: "/server/api/Api.php?service=" + service,
            data: {data: JSON.stringify(data)},
            dataType: "json",
            statusCode: {
                401: function () {
                    router.push("/login");
                }
            }
        }).done(function (data: any) {
            let json = JSON.stringify(data);
            json = json.replaceAll("\"true\"", "true");
            json = json.replaceAll("\"false\"", "false");
            data = JSON.parse(json);

            if (data.result) {
                success(data);
            } else {
                messages.hideSaveMessage();
                messages.showError(data.error);
            }
        }).fail(function (response: any) {
            data.token = undefined;
            let user = useStore().user.call

            let message = "url: " + window.location.href + "<br>\n";
            message += "user: " + user + "<br>\n";
            message += +service + "<br>\n";
            message += JSON.stringify(data, null, 2) + "<br>\n";
            if (response.responseText) {
                message += response.responseText;
            } else {
                message += JSON.stringify(response);
            }
            load("app.ticket", {id: data.uid || '', message: message}, () => {
            });

            messages.confirm(i18n.global.t("Si è verificato un errore, vuoi segnalarlo?"), () => {
                let message = JSON.stringify(data) + " | " + response.responseText;
                openTicket(message);
            });
        }).always(function () {
            messages.hideSaveMessage();
        });
    });
}

/*
declare const grecaptcha: any;

function addToken(service: string, data: any, success: any, error: any, callback: any) {
    //if (!excludeVerification.includes(service)) {
        grecaptcha.ready(async function () {
            //console.log('reCAPTCHA is ready');
            const globalState = useStore();
            //console.log(service);
            try {
                const token = await globalState.request();
                data.token = token;
                callback(service, data, success, error);
            } catch (e) {
                //console.log(e);
                setTimeout(() => {
                    addToken(service, data, success, error, callback);
                }, 200);
                return;
            }
        });
    //}
}
*/
export const server = {
    load,
    save,

}
