<script lang="ts" setup>

import ActivityPanel from "./ActivityPanel.vue";
import {reactive} from "vue";
import {BO_Activation} from "../BO/BO_Activation.ts";
import {getStatusDesc} from "../utils.ts";
import {router} from "../../routes.ts";
import {useStore} from "../../store/Store.ts";
import {messages} from "../messages.ts";
import {server} from "../server.ts";
import {StatusAttivazione} from "../BO/StatusAttivazione.ts";
import {useToast} from "vue-toastification";
import {i18n} from "../translations.ts";


const globalState = useStore();
const state = reactive({
  attivazione: new BO_Activation(),
  loaded: false,
})
const toast = useToast();

defineProps({
  uid: String,
})

const setAtt = (att: BO_Activation) => {
  state.attivazione = att;
  state.loaded = true;
}

const editAtt = () => {
  router.push({name: 'edit', params: {uid: state.attivazione.uid}});
}

const download = () => {
  window.open("/server/api/Api.php?service=attivazioni.download&uid=" + state.attivazione.uid, "_blank");

}

const setStatus = () => {
  toast.info(i18n.global.t("Modifica visibilità in corso"));
  server.save("attivazioni.changeStatus", {uid: state.attivazione.uid, status: state.attivazione.status}, () => {
    toast.clear();
    toast.success(i18n.global.t("Visibilità modificata"));
    //router.push({name: 'status', params: {uid: state.attivazione.uid}});
  });
}

const remove = () => {
  messages.confirm(i18n.global.t("Sei sicuro di voler eliminare l'attivazione?"), () => {
    server.save("attivazioni.delete", {uid: state.attivazione.uid}, (response: any) => {
      if (response.success) {
        router.push({name: 'home'});
      }
    });
  });
}

const print = () => {
  //router.push({name: 'print', params: {uid: state.attivazione.uid}});
  window.open("/print/" + state.attivazione.uid, "_blank");
}
/*
const downloadMQC = () => {
  window.open('https://www.mountainqrp.it/report/wp/diplomi/download.php?uid=' + state.attivazione.uid, '_blank');
}

*/

</script>

<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col ">
        <ActivityPanel :uid="uid" @update:loaded="setAtt"></ActivityPanel>
      </div>
      <div v-if="globalState.user.call==state.attivazione.operatore || globalState.user.role=='MANAGER'" class="col-3">
        <div v-if="!state.loaded">
          <Skeleton class="mr-2" size="10rem"></Skeleton>
        </div>

        <div v-if="state.loaded">
          <div class="list-group">
            <a class="list-group-item list-group-item-action list-group-item-light" href="#" @click="editAtt"><i class="fa-solid fa-pen-to-square"></i> {{ $t('modifica') }}</a>
            <a class="list-group-item list-group-item-action list-group-item-light" data-bs-target="#share" data-bs-toggle="modal" href="#">
              <i class="fa-solid fa-share-nodes"></i> {{ $t('condividi') }}
            </a>
            <a class="list-group-item list-group-item-action list-group-item-light" href="#" @click="download"><i class="fa-solid fa-cloud-arrow-down"></i> {{ $t('scaricaAdif') }}</a>
            <a class="list-group-item list-group-item-action list-group-item-light" href="#" @click="print"><i class="fa-solid fa-print"></i> {{ $t('print') }}</a>
            <a class="list-group-item list-group-item-action list-group-item-light" data-bs-target="#status" data-bs-toggle="modal" href="#"><i class="fa-solid fa-eye"></i> {{ $t('visibileA') }} <b>{{ getStatusDesc(state.attivazione.status) }}</b></a>
            <a class="list-group-item list-group-item-action list-group-item-light" href="#" @click="remove"><i class="fa-solid fa-trash"></i> {{ $t('elimina') }}</a>
            <!--
                        <a v-if="state.attivazione.uid.indexOf('_')>-1" class="list-group-item list-group-item-action " href="#" @click="downloadMQC">Download immagini</a>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="status" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('visibilit') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div class="">
            <div class="card p-3 m-3">
              <div class="form-check d-flex align-items-center">
                <input id="private" v-model="state.attivazione.status" :value="StatusAttivazione.PRIVATA" class="form-check-input" name="share" type="radio">
                <label class="form-check-label fw-bold fs-5 ms-3" for="private"><i class="fa-solid fa-lock"></i> {{ $t('soloIo') }}</label>
              </div>
              <div class="ms-5">
                <p>{{ $t('lattivitSarVisibileSoloATe') }}<br>
                  {{ $t('sarConteggiataNelleStatisticheMaNonContribuirAllot') }}</p>
              </div>
            </div>
            <div class="card p-3 m-3">
              <div class="form-check d-flex align-items-center">
                <input id="public" v-model="state.attivazione.status" :value="StatusAttivazione.PUBBLICA" class="form-check-input" name="share" type="radio">
                <label class="form-check-label fw-bold fs-5 ms-3" for="public"><i class="fa-solid fa-globe"></i> {{ $t('tutti') }}</label>
              </div>
              <div class="ms-5">
                <p>{{ $t('lattivitSarVisibileATutti') }}<br>
                  {{ $t('contribuirAllottenimentoDegliAttestati') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">{{ $t('chiudi') }}</button>
          <button class="btn btn-primary" data-bs-dismiss="modal" type="button" @click="setStatus">{{ $t('salva') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div id="share" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('condividi') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <!--suppress AllyHtmlVueInspection -->
        <div class="modal-body">
          Link: <input :value="'https://portable.radioexperiences.net/social.php?uid=' + state.attivazione.uid" class="form-control" type="text">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">{{ $t('chiudi') }}</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>