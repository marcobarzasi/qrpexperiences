import {createI18n} from 'vue-i18n'

import {version} from "../../package.json";
import {ref} from "vue";
import {generateUID} from "./utils.ts";

let ver = ref(version);
const mode = import.meta.env.MODE;


if (mode == 'dev' || mode == 'localhost') {
    ver.value = generateUID();
}

export const getTranslation = (lang: string) => {

    //if (mode == 'dev' || mode == 'localhost') {
        let t_dev = {};
        const request = new XMLHttpRequest();
    request.open('GET', '/server/translation/' + lang + '.json?v=' + ver.value, false); // false makes the request synchronous
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                t_dev = JSON.parse(request.responseText);
            } else {
                console.error('Error fetching ' + lang + '.json:', request.statusText);
            }
        };
        request.onerror = function () {
            console.error('Error fetching ' + lang + '.json:', request.statusText);
        };
        request.send();
        return t_dev;
    /*} else {
        switch (lang) {
            case 'it':
                return it;
            case 'de':
                return de;
            case 'es':
                return es;
            default:
                return en;
        }
    }*/

}

export const allowedLanguages = ['en', 'it', 'de', 'es'];
const browserLanguage = navigator.language.split('-')[0]
export const i18n = createI18n({
    locale: browserLanguage,
    fallbackLocale: 'en',
    messages: {
        en: getTranslation('en'),
        it: getTranslation('it'),
        de: getTranslation('de'),
        es: getTranslation('es'),
    },
})

export function setLanguage(code: string) {
    if (allowedLanguages.includes(code as any)) {
        i18n.global.locale = code as "en" | "it" | "de" | "es";
    } else {
        i18n.global.locale = "en";
    }
}

export const primeVueLocalOptions = {
    "startsWith": "Inizia con",
    "contains": "Contiene",
    "notContains": "Non contiene",
    "endsWith": "Finisce con",
    "equals": "Equivale",
    "notEquals": "Non uguale",
    "noFilter": "Senza Filtro",
    "filter": "Filtro",
    "lt": "Minore di",
    "lte": "Minore o uguale a",
    "gt": "Maggiore di",
    "gte": "Maggiore o uguale a",
    "dateIs": "La data è",
    "dateIsNot": "La data non è",
    "dateBefore": "La data è precedente",
    "dateAfter": "La data è successiva",
    "custom": "Personalizzato",
    "clear": "Cancella",
    "apply": "Applica",
    "matchAll": "Tutte le regole",
    "matchAny": "Almeno una regola",
    "addRule": "Aggiungi regola",
    "removeRule": "Rimuovi regola",
    "accept": "Si",
    "reject": "No",
    "choose": "Scegli",
    "upload": "Carica",
    "cancel": "Annulla",
    "completed": "Completato",
    "pending": "In corso",
    "fileSizeTypes": ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    "dayNames": [
        "Domenica",
        "Lunedi",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato"
    ],
    "dayNamesShort": [
        "Dom",
        "Lun",
        "Mar",
        "Mer",
        "Gio",
        "Ven",
        "Sab"
    ],
    "dayNamesMin": [
        "Do",
        "Lu",
        "Ma",
        "Me",
        "Gi",
        "Ve",
        "Sa"
    ],
    "monthNames": [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre"
    ],
    "monthNamesShort": [
        "Gen",
        "Feb",
        "Mar",
        "Apr",
        "Mag",
        "Giu",
        "Lug",
        "Ago",
        "Set",
        "Ott",
        "Nov",
        "Dic"
    ],
    "chooseYear": "Seleziona Anno",
    "chooseMonth": "Seleziona Mese",
    "chooseDate": "Seleziona Data",
    "prevDecade": "Decade precedente",
    "nextDecade": "Decade successiva",
    "prevYear": "Anno precedente",
    "nextYear": "Anno successivo",
    "prevMonth": "Mese precedente",
    "nextMonth": "Mese successivo",
    "prevHour": "Ora precedente",
    "nextHour": "Ora successiva",
    "prevMinute": "Minuto precedente",
    "nextMinute": "Minuto successivo",
    "prevSecond": "Secondo precedente",
    "nextSecond": "Secondo successivo",
    "am": "AM",
    "pm": "PM",
    "today": "Oggi",
    "now": "Ora attuale",
    "weekHeader": "Sett",
    "firstDayOfWeek": 1,
    "showMonthAfterYear": false,
    "dateFormat": "dd/mm/yy",
    "weak": "Debole",
    "medium": "Medio",
    "strong": "Forte",
    "passwordPrompt": "Inserisci la password",
    "emptyFilterMessage": "Nessuna opzione disponibile",
    "searchMessage": "{0} risultati disponibili",
    "selectionMessage": "{0} elementi selezionati",
    "emptySelectionMessage": "Nessun elemento selezionato",
    "emptySearchMessage": "Nessun risultato trovato",
    "emptyMessage": "Nessun risultato trovato",
    "aria": {
        "trueLabel": "Vero",
        "falseLabel": "Falso",
        "nullLabel": "Non selezionato",
        "pageLabel": "Pagina {page}",
        "firstPageLabel": "Prima pagina",
        "lastPageLabel": "Ultima pagina",
        "nextPageLabel": "Pagina successiva",
        "previousPageLabel": "Pagina precedente",
        "selectLabel": "Seleziona",
        "unselectLabel": "Deseleziona",
        "expandLabel": "Espandi",
        "collapseLabel": "Riduci",
        "star": "1 stella",
        "stars": "{star} stelle",
        "selectAll": "Seleziona tutti gli elementi",
        "unselectAll": "Deseleziona tutti gli elementi",
        "close": "Chiudi",
        "previous": "Precedente",
        "next": "Successivo",
        "navigation": "Naviga",
        "scrollTop": "Torna sù",
        "moveTop": "Vai in cima",
        "moveUp": "Vai sopra",
        "moveDown": "Vai sotto",
        "moveBottom": "Vai in fondo",
        "moveToTarget": "Vai all'elemento",
        "moveToSource": "Vai alla sorgente",
        "moveAllToTarget": "Muovi tutto all'elemento",
        "moveAllToSource": "Muovi tutto alla sorgente",
        "rowsPerPageLabel": "Elementi per pagina",
        "jumpToPageDropdownLabel": "Vai alla Dropdown delle pagine",
        "jumpToPageInputLabel": "Vai all'Input delle pagine",
        "selectRow": "Seleziona riga",
        "unselectRow": "Deseleziona riga",
        "expandRow": "Espandi riga",
        "collapseRow": "Riduci riga",
        "showFilterMenu": "Mostra Menu filtri",
        "hideFilterMenu": "Nascondi Menu filtri",
        "filterOperator": "Operatore di filtro",
        "filterConstraint": "Costante di filtro",
        "editRow": "Modifica riga",
        "saveEdit": "Salva modifica",
        "cancelEdit": "Annulla modifica",
        "listView": "Lista",
        "gridView": "Griglia",
        "slide": "Scorri",
        "slideNumber": "{slideNumber}",
        "zoomImage": "Zoom Immagine",
        "zoomIn": "Ingrandisci",
        "zoomOut": "Riduci",
        "rotateRight": "Ruota a destra",
        "rotateLeft": "Ruota a sinistra"
    }

};