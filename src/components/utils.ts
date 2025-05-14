import moment from "moment";
import {Categorie} from "./BO/Categorie.ts";
import {i18n} from "./translations.ts";

export const checkEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
export const formatDate = (value: string | null) => {
    if (moment(value).isValid()) {
        return moment(value).format('DD/MM/YYYY');
    } else {
        return "";
    }

};

export const formatNumber = (number: number): string => {
    return number.toLocaleString('it-IT');
};

export const checkRequiredField = (value: string | number, fieldStatus: any) => {

    if (
        ((typeof value) == "number" && value == 0)
        || ((typeof value) == "string" && value == "")
    ) {
        fieldStatus.error = i18n.global.t("CampoObbligatorio");
        fieldStatus.status = "INVALID";
        return false;
    } else {
        fieldStatus.error = "";
        fieldStatus.status = "VALID";
        return true;
    }
}

export function gridSquareToLatLon(grid: string) {


    var lat = 0.0,
        lon = 0.0,
        aNum = "a".charCodeAt(0),
        numA = "A".charCodeAt(0);

    function lat4(g: string) {
        return 10 * (g.charCodeAt(1) - numA) + parseInt(g.charAt(3)) - 90;
    }

    function lon4(g: string) {
        return 20 * (g.charCodeAt(0) - numA) + 2 * parseInt(g.charAt(2)) - 180;
    }

    if ((grid.length != 4) && (grid.length != 6)) throw "gridSquareToLatLon: grid must be 4 or 6 chars: " + grid;
    if (/^[A-X][A-X][0-9][0-9]$/.test(grid)) {
        lat = lat4(grid) + 0.5;
        lon = lon4(grid) + 1;
    } else if (/^[A-X][A-X][0-9][0-9][A-X][A-X]$/.test(grid)) {
        lat = lat4(grid) + (1.0 / 60.0) * 2.5 * (grid.toLowerCase().charCodeAt(5) - aNum + 0.5);
        lon = lon4(grid) + (1.0 / 60.0) * 5 * (grid.toLowerCase().charCodeAt(4) - aNum + 0.5);
    } else throw "gridSquareToLatLon: invalid grid: " + grid;

    return [lon, lat];
};

export function latLonToGridSquare(param1: any, param2: any): string {
    var lat = -100.0;
    var lon = 0.0;
    var adjLat, adjLon, GLat, GLon, nLat, nLon, gLat, gLon, rLat, rLon;
    var U = 'ABCDEFGHIJKLMNOPQRSTUVWX'
    var L = U.toLowerCase();
    // support Chris Veness 2002-2012 LatLon library and
    // other objects with lat/lon properties
    // properties could be numbers, or strings
    function toNum(x: any) {
        if (typeof (x) === 'number') return x;
        if (typeof (x) === 'string') return parseFloat(x);
        // dont call a function property here because of binding issue
        throw "HamGridSquare -- toNum -- can not convert input: " + x;
    }

    if (typeof (lat) === 'object') {
        if (param1.length === 2) {
            lat = toNum(param1[0]);
            lon = toNum(param1[1]);
        } else if (('lat' in param1) && ('lon' in param1)) {
            lat = (typeof (param1.lat) === 'function') ? toNum(param1.lat()) : toNum(param1.lat);
            lon = (typeof (param1.lon) === 'function') ? toNum(param1.lon()) : toNum(param1.lon);
        } else if (('latitude' in param1) && ('longitude' in param1)) {
            lat = (typeof (param1.latitude) === 'function') ? toNum(param1.latitude()) : toNum(param1.latitude);
            lon = (typeof (param1.longitude) === 'function') ? toNum(param1.longitude()) : toNum(param1.longitude);
        } else {
            throw "HamGridSquare -- can not convert object -- " + param1;
        }
    } else {
        lat = toNum(param1);
        lon = toNum(param2);
    }
    if (isNaN(lat)) throw "lat is NaN";
    if (isNaN(lon)) throw "lon is NaN";
    if (Math.abs(lat) === 90.0) throw "grid squares invalid at N/S poles";
    if (Math.abs(lat) > 90) throw "invalid latitude: " + lat;
    if (Math.abs(lon) > 180) throw "invalid longitude: " + lon;
    adjLat = lat + 90;
    adjLon = lon + 180;
    GLat = U[Math.trunc(adjLat / 10)];
    GLon = U[Math.trunc(adjLon / 20)];
    nLat = '' + Math.trunc(adjLat % 10);
    nLon = '' + Math.trunc((adjLon / 2) % 10);
    rLat = (adjLat - Math.trunc(adjLat)) * 60;
    rLon = (adjLon - 2 * Math.trunc(adjLon / 2)) * 60;
    gLat = L[Math.trunc(rLat / 2.5)];
    gLon = L[Math.trunc(rLon / 5)];
    return GLon + GLat + nLon + nLat + gLon + gLat;
}

export function bytesToSize(bytes: number) {
    if (bytes < 0) bytes = 0;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt("" + (Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d);
}

export function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    let a = (Math.random() * 46656) | 0;
    let b = (Math.random() * 46656) | 0;
    let c = (Math.random() * 46656) | 0;
    let d = (Math.random() * 46656) | 0;
    let a1 = ("000" + a.toString(36)).slice(-3);
    let b1 = ("000" + b.toString(36)).slice(-3);
    let c1 = ("000" + c.toString(36)).slice(-3);
    let d1 = ("000" + d.toString(36)).slice(-3);
    return a1 + b1 + c1 + d1;
}

export function extractVideoID(url: string) {
    if (url == '' || url == null) return '';
    let urlObj = new URL(url);
    let params = new URLSearchParams(urlObj.search);
    let id = params.get('v');
    if (id == null)
        id = urlObj.pathname.split('/')[1];

    if (id == null) id = '';
    return id;
}

export const getBandGroup = (banda: string) => {
    switch (banda.toLowerCase()) {
        case "160m":
        case "80m":
        case "60m":
        case "40m":
        case "30m":
        case "20m":
        case "17m":
        case "15m":
        case "12m":
        case "10m":
            return "HF";
        case "6m":
        case "2m":
            return "VHF";
        case "70Cm":
            return "UHF";
        default:
            return "";
    }

}

export const getBandMColor = (banda: string) => {
    var background = "";
    var foreground = "white";

    switch (banda.toLowerCase()) {
        case "160m":
            background = "#B5E5CF";
            foreground = "black"
            break;
        case "80m":
            background = "#F8D211";
            break;
        case "60m":
            background = "#FA26A0";
            break;
        case "40m":
            background = "#B68D40";
            break;
        case "30m":
            background = "#122620";
            break;
        case "20m":
            background = "#30F3E0";
            foreground = "black"
            break;
        case "17m":
            background = "#FCB5AC";
            break;
        case "15m":
            background = "#3D5B59";
            //foreground="black"
            break;
        case "12m":
            background = "#792931";
            break;
        case "10m":
            background = "#81B622";
            break;
        case "6m":
            background = "#1401FF";
            break;
        case "2m":
            background = "#7EC8E3";
            break;
        case "70Cm":
            background = "#B4F8C7";
            foreground = "black"
            break;
        default:
            background = "#EEEDE7";
            foreground = "black"
            break;
    }
    return [foreground, background];
}

export const getStatusDesc = (status: string) => {
    switch (status) {
        case "PUBBLICA":
            return i18n.global.t('tutti');
        case "PRIVATA":
            return i18n.global.t('soloIo');
        default:
            return status;
    }
}

export function getCategoryUrl(category: string) {
    // const url = import.meta.env.VITE_API_URL || "https://pota.radioexperiences.net";
    const mode = import.meta.env.MODE;

    let urlPota = (mode == 'dev' ? 'http://potaexperiences.ddns.net:8100' : 'https://pota.radioexperiences.net');
    let urlPortable = (mode == 'dev' ? 'http://portableexperiences.ddns.net:8100' : 'https://portable.radioexperiences.net');


    switch (category) {
        case Categorie.POTA:
            return urlPota;//"https://pota.radioexperiences.net";
        //return import.meta.env.POTA_URL;
        case Categorie.PORTABLE:
            return urlPortable;
        case Categorie.CONTEST:
            return import.meta.env.CONTEST_URL;
        default:
            return "";
    }
}