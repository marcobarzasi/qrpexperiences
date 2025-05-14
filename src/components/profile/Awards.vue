<script lang="ts" setup>

import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";

import {useStore} from "../../store/Store.ts";
import {onMounted, reactive, watch} from "vue";
import {server} from "../server.ts";

import {messages} from "../messages.ts";


import {BO_qrbBand} from "../BO/BO_qrbBand.ts";

import QRB_VHF_Stack from "./attestati/QRB/QRB_VHF_Stack.vue";
import QSO_Stack from "./attestati/QSO/QSO_Stack.vue";
import QRP_Stack from "./attestati/QSO/QRP_Stack.vue";
import {BO_qso} from "../BO/BO_qso.ts";
import ATT_Stack from "./attestati/Activity/ATT_Stack.vue";
import DXCC_Stack from "./attestati/DXCC/DXCC_Stack.vue";
import {BO_dxcc} from "../BO/BO_dxcc.ts";
import AroundWord_HF_Stack from "./attestati/QRB/AroundWord_HF_Stack.vue";


const globalState = useStore();
const state = reactive({
  attivazioni: [] as BO_ActivationRow[],
  qrbByBand: [] as BO_qrbBand[],
  qso: [] as BO_qso[],
  dxcc: [] as BO_dxcc[],

  dxccLoaded: false,
  qrbLoaded: false,
  qsoLoaded: false,
  attLoaded: false,
})


const loadAttivazioni = () => {
  let data = {
    call: globalState.user.call,
  };
  server.load("attestati.listByBand", data, (response: any) => {
    if (response.success) {
      state.qrbLoaded = data.call != '';
      state.qrbByBand = response.result.list;
    } else {
      messages.showError(response.error);
    }
  })
  server.load("attestati.listByQSO", data, (response: any) => {
    if (response.success) {
      state.qsoLoaded = data.call != '';
      state.qso = response.result.list;
    } else {
      messages.showError(response.error);
    }
  })

  server.load("attestati.listByDXCC", data, (response: any) => {
    if (response.success) {
      state.dxcc = response.result.list;
      state.dxccLoaded = data.call != '';
    } else {
      messages.showError(response.error);
    }
  })

  server.load("attivazioni.listByCall", data, (response: any) => {
    if (response.success) {
      state.attivazioni = response.result.list;
      state.attLoaded = data.call != '';
    } else {
      messages.showError(response.error);
    }
  })

}


watch(() => globalState.user.call, (newVal, oldVal) => {
  if (newVal != oldVal) {
    loadAttivazioni();
  }
})


onMounted(() => {
  loadAttivazioni();
});

</script>

<template>
  <div class="container mt-3">

    <div>
      <QRB_VHF_Stack :att="state.qrbByBand" :loaded="state.qrbLoaded"></QRB_VHF_Stack>
      <AroundWord_HF_Stack :att="state.qrbByBand" :loaded="state.qrbLoaded"></AroundWord_HF_Stack>

      <QSO_Stack :loaded="state.qsoLoaded" :qso="state.qso"></QSO_Stack>
      <QRP_Stack :loaded="state.qsoLoaded" :qso="state.qso"></QRP_Stack>

      <ATT_Stack :att="state.attivazioni" :loaded="state.attLoaded"></ATT_Stack>

      <DXCC_Stack :dxcc="state.dxcc" :loaded="state.dxccLoaded"></DXCC_Stack>
    </div>
  </div>

</template>

<style scoped>

</style>