import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import {i18n, primeVueLocalOptions} from "./components/translations.ts";
import PrimeVue from "primevue/config";
import {App} from "@vue/runtime-core";
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Dropdown from "primevue/dropdown";
import FloatLabel from 'primevue/floatlabel';
import Toast, {POSITION} from "vue-toastification";
import "vue-toastification/dist/index.css";
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import CKEditor from '@ckeditor/ckeditor5-vue'
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Knob from 'primevue/knob';
import 'vue-lite-youtube-embed/style.css'
import 'primevue/resources/themes/aura-light-blue/theme.css';
import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons CSS
import 'primeflex/primeflex.css';
import FlagIcon from 'vue-flag-icon';
import VueCookies from 'vue-cookies'
import VueGtag from "vue-gtag";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const addUsing = (app: App<Element>) => {
    app.component('InputIcon', InputIcon);
    app.component('IconField', IconField);
    app.component('InputGroup', InputGroup);
    app.component('InputGroupAddon', InputGroupAddon);
    app.component('Knob', Knob);
    app.component('Dropdown', Dropdown);
    app.component('Toast', Toast);
    app.component('FloatLabel', FloatLabel);
    app.component('DataView', DataView);
    app.component('DataViewLayoutOptions', DataViewLayoutOptions);
    app.component('InputText', InputText);

    app.component('Stepper', Stepper);
    app.component('StepperPanel', StepperPanel);

    /*    app.use(VueRecaptchaPlugin, {
            v3SiteKey: '6Le3hCAqAAAAANRy4Q-Mo12bwfRtOGIgkmfHKtFF',
        })*/

    if (getCookie('cookielawinfo-checkbox-analytics') == "true") {
        app.use(VueGtag, {config: {id: "G-59ZLP7DK25"}});
    }
    app.use(VueCookies, {expires: '7d'})

    app.use(FlagIcon);
    app.use(CKEditor);
    app.use(pinia);
    //app.use(ToastService);
    app.use(PrimeVue, {locale: primeVueLocalOptions});
    app.use(Toast, {
        position: POSITION.TOP_CENTER,
        closeButton: false,
        hideProgressBar: true,
    });



    app.use(i18n)



}

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`) || [];
    if (parts.length === 2) {
        const part = parts.pop();
        return part ? part.split(';').shift() : null;
    }
    return null;
}