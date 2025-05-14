import "primeflex/primeflex.css";
import "./style.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeicons/primeicons.css";
import {createApp} from "vue";
import App from "./App.vue";
import {addUsing} from "./base.ts";
import {router} from "./routes.ts";
import {useStore} from './store/Store.ts'
import {server} from "./components/server.ts";
import {messages} from "./components/messages.ts";
import {generateUID} from "./components/utils.ts";
import {setLanguage} from "./components/translations.ts";

let app;
app = createApp(App);


addUsing(app);
app.use(router)
app.mount("#app");

const globalState = useStore();

let data = {};
server.load("user.getLogged", data, (response: any) => {
    if (response.success) {
        globalState.user = response.result.userInfo;
        if (globalState.user.call != '') {
            localStorage.setItem('authToken', generateUID());
            if (globalState.user.language == "") {
                const browserLanguage = navigator.language.split('-')[0];
                setLanguage(browserLanguage);
            } else {
                setLanguage(globalState.user.language);
            }
        } else {
            localStorage.removeItem('authToken');
        }
    } else {
        messages.showError(response.error);
    }
})
