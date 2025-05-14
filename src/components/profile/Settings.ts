import {reactive} from "vue";
import {BO_User} from "../BO/BO_User.ts";
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import './settings.css';
import {useToast} from "vue-toastification";
import {i18n} from "../translations.ts";

export const useSharedLogicSettings = () => {
    const toast = useToast();

    const state = reactive({
        user: new BO_User(),
        password: "",
        password2: "",
    })

    const langs = [
        {value: 'it', label: 'Italiano', flag: 'it'},
        {value: 'en', label: 'Inglese', flag: 'gb'},
        {value: 'de', label: 'Tedesco', flag: 'de'},
        {value: 'es', label: 'Spagnolo', flag: 'es'},
    ];

    const save = () => {
        if (state.password == "" && state.user.changePassword) {
            messages.showMessage("error", i18n.global.t("Inserire una nuova password"));
            return;
        }

        if (state.password != state.password2) {
            messages.showMessage("error", i18n.global.t("Le password non coincidono"));
            return;
        }

        if (state.user.email == "") {
            messages.showMessage("error", i18n.global.t("L'eMail è obbligatoria"));
            return;
        }

        let data = {
            ...state,
        };
        server.save('profile.save', data, (response: any) => {
            if (response.success) {
                loadUser();
                toast.success(i18n.global.t("Profilo salvato"));
            } else {
                messages.showError(response.error);
            }
        })
    }

    const loadUser = () => {

        let data = {};
        server.load("user.getLogged", data, (response: any) => {
            if (response.success) {
                state.user = response.result.userInfo;
            } else {
                messages.showError(response.error);
            }
        })

    }
    loadUser();

    return {
        state,
        langs,
        save,

    };
}