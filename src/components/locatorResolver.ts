import {BO_qso} from "./BO/BO_qso.ts";
import {server} from "./server.ts";

export function resolveLocators(qso: BO_qso[], resolvedAll: Function) {
    lastIdx = 0;
    resolveGroupLocator(qso, resolvedAll);
}

let lastIdx = 0;
const groups = 5;

function resolveGroupLocator(qso: BO_qso[], resolvedAll: Function) {
    let list = [];
    let idx = 0;

    while (idx <= groups && lastIdx < qso.length) {
        if (qso[lastIdx].wwl == "") {
            list.push(resolveLocator(qso[lastIdx]));
            idx++;
        }
        lastIdx++;
    }

    Promise.all(list).then(() => {
        if (lastIdx < qso.length) {
            resolveGroupLocator(qso, resolvedAll);
        } else {
            resolvedAll();
        }
    });
}

function resolveLocator(qso: BO_qso) {
    return new Promise((resolve) => {

        server.load("attivazioni.resolveWWL", {qso: qso}, (data: any) => {
            if (data.success) {
                if (data.result.wwl != "") {
                    qso.wwl = data.result.wwl.toUpperCase();
                }
            }
            resolve('');
        });

    });
}


export function resolveLocatorCall(call: string, success: Function) {

    server.load("attivazioni.resolveWWLCall", {call: call}, (data: any) => {
        if (data.success) {
            success(data.result.wwl);
        } else {
            success("");
        }
    });
}

/*

var resolveAll = false;
var groupStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function ajaxLocator(call, seq) {
    var data = "call=" + call + "&seq=" + seq;
    return ajaxCall(data, 'ajaxLocator.php', true);
}


function resolveAllLocators() {
    this.resolveAll = true;
    for (var n = 0; n < 10; n++) {
        this.resolveLocator(n, n);
    }
}

function resolveLocator(index, group) {
    setGroupStatus(group, 1);
    if (index >= app.state.att.log.length) {
        setGroupStatus(group, 0);
        return;
    }

    if (app.state.att.log[index].wwl != "") {
        if (index < app.state.att.log.length) {
            this.resolveLocator(index + 10, group);
        } else {
            setGroupStatus(group, 0);
        }
        return;
    }

    var call = app.state.att.log[index].call;
    var ref = app.state.att.log[index].sigInfo;

    if (ref !== "") {
        var data = "ref=" + ref;
        ajaxCall(data, 'ajaxRef.php', true).then((data) => {
            if (data && data.nome !== "" && data.nome != null) {
                app.state.att.log[index].wwl = data.locatore.toUpperCase();
                app.state.att.log[index].wrongWWL = false;
            }
            if (index < app.state.att.log.length) {
                this.resolveLocator(index + 10, group);
            } else {
                setGroupStatus(group, 0);
            }
        }).catch((message) => {
            alert("Error: " + message);
            app.state.wwlSearch = false;
            app.state.alertLog = {show: false, message: ""};
        });
    } else {
        ajaxLocator(call, index).then((data) => {
            app.state.att.log[index].wwl = data.wwl.toUpperCase();
            app.state.att.log[index].wrongWWL = !data.valid;

            //updateQSOGrid(qsos[index]);

            if (index < app.state.att.log.length) {
                this.resolveLocator(index + 10, group);
            } else {
                setGroupStatus(group, 0);
            }
        }).catch((error) => {
            alert("Error: " + error);
            app.state.wwlSearch = false;
            app.state.alertLog = {show: false, message: ""};
        });
    }


}


function setGroupStatus(group, status) {
    groupStatus[group] = status;

    var active = groupStatus.some((s) => {
        return s == 1;
    });

    if (active) {
        suspendMapUpdate = true;
        app.state.wwlSearch = true;
        app.state.alertLog = {show: true, message: "Ricerca dei locatori... attendere."};
        resolveAll = true;
    } else {
        suspendMapUpdate = false;
        app.state.wwlSearch = false;
        app.state.alertLog = {show: false, message: ""};
        resolveAll = false;
        checkLog();

    }

}
*/