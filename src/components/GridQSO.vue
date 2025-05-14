<script setup lang="ts">
import {computed, ModelRef, reactive, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {BO_qso} from "./BO/BO_qso.ts";

import {formatDate} from "./utils.ts";
import QSO from "./activity/wizard/QSO.vue";
import {messages} from "./messages.ts";
import {useStore} from '../store/Store.ts'
import {i18n} from "./translations.ts";

const globalState = useStore();

const emit = defineEmits(['logbook:check'])
const rows: ModelRef<BO_qso[]> = defineModel('value', {required: true});

defineProps({
  row: Object,
  hideQSL: {Boolean, default: false},
  hideToolbar: {Boolean, default: false},
  showErrors: {Boolean, default: false},
  isPrint: {Boolean, default: false},
})

const rowsInError = computed(() => {
  return rows.value.filter((qso) => {
    return qso.wrongCall || qso.wrongWWL || qso.dupe;
  })
})


const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  call: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  ref: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  banda_m: {value: null, matchMode: FilterMatchMode.EQUALS},
  wwl: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
  modo: {value: null, matchMode: FilterMatchMode.EQUALS},
});

const state = reactive({
  currentQSO: new BO_qso(),
  newQSO: false,
  allQSL: false,
})


const toggleQSL = () => {
  rows.value.forEach((qso) => {
    qso.qsl_send = !state.allQSL;
  })
}

const resetAllQSO = () => {
  state.allQSL = false;
}

const getBandMColor = (banda: string) => {
  var background = "";
  var foreground = "white";

  switch (banda.toUpperCase()) {
    case "160M":
      background = "#B5E5CF";
      foreground = "black"
      break;
    case "80M":
      background = "#F8D211";
      break;
    case "60M":
      background = "#FA26A0";
      break;
    case "40M":
      background = "#B68D40";
      break;
    case "30M":
      background = "#122620";
      break;
    case "20M":
      background = "#30F3E0";
      foreground = "black"
      break;
    case "17M":
      background = "#FCB5AC";
      break;
    case "15M":
      background = "#3D5B59";
      //foreground="black"
      break;
    case "12M":
      background = "#792931";
      break;
    case "10M":
      background = "#81B622";
      break;
    case "6M":
      background = "#1401FF";
      break;
    case "2M":
      background = "#7EC8E3";
      break;
    case "70CM":
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

const getDX = () => {
  let km = 0;
  let call = "";
  rows.value.forEach((qso) => {
    if (qso.km > km) {
      km = qso.km;
      call = qso.call;
    }
  })

  return call + " (" + km + " Km)"
}


const newQSO = () => {
  state.newQSO = true;
  $('#dettaglio_qso').modal('show');
}

const addQSO = (q: BO_qso) => {
  rows.value.push(q);
}

const closeQSO = () => {
  state.newQSO = false;
  emit('logbook:check');
}

const deleteQSO = (q: BO_qso) => {
  messages.confirm(i18n.global.t("deleteQSOCall", {call: q.call}), () => {
    rows.value = rows.value.filter((item) => {
      return item != q;
    })
  })
}


defineExpose({
  newQSO
})


</script>

<template>
  <div v-if="rowsInError.length>0 && showErrors && !isPrint" class="card shadow-1 p-3">
    <h2 class="text-danger">{{ $t('qsoInErrore') }}</h2>
    <DataTable :value="rowsInError"
               stripedRows
    >
      <Column class="border-bottom" header="Errore">
        <template #body="{ data }">
          <span v-if="(data as BO_qso).wrongCall" class="text-danger "><i class="fa-solid fa-triangle-exclamation"></i> <label>{{ $t('callErrato') }}</label></span>
          <span v-if="(data as BO_qso).dupe" class="text-danger "><i class="fa-solid fa-triangle-exclamation"></i> <label>{{ $t('duplicato') }}</label></span>
          <span v-if="(data as BO_qso).wrongWWL" class="text-danger "><i class=" fa-solid fa-triangle-exclamation"></i> <label>{{ $t('wwlErrato') }}</label></span>
        </template>
      </Column>
      <Column :header="$t('data')" class="border-bottom" field="data">
        <!--suppress AllyHtmlVueInspection -->
        <template #body="{ data }">
          {{ formatDate((data as BO_qso).data) }}
        </template>
      </Column>

      <Column class="border-bottom" field="time" header="UTC">

      </Column>

      <Column class="border-bottom" field="call" header="Call">
      </Column>

      <Column :header="$t('banda')" class="border-bottom" field="banda_m">
        <template #body="{ data }">
          <!--suppress AllyHtmlVueInspection -->
          <span :style="'background-color:'+getBandMColor((data as BO_qso).banda_m)[1]+';color:'+getBandMColor((data as BO_qso).banda_m)[0]"
              class="badge p-2 fs-6">{{ (data as BO_qso).banda_m }}</span>

        </template>
      </Column>

      <Column :header="$t('modo')" class="border-bottom" field="modo">
      </Column>

      <Column class="border-bottom" field="wwl" header="WWL">
      </Column>

      <Column class="border-bottom" field="ref" header="Ref.">
      </Column>
    </DataTable>

  </div>


  <DataTable :value="rows" class="mt-5"
             v-model:filters="filters" filterDisplay="menu"
             :sortOrder="1" removableSort sortField="time"
             stripedRows
             :paginator="!isPrint" :rows="50" :rowsPerPageOptions="[50, 100, 200]"
  >
    <template #header>
      <div v-if="!isPrint" class="d-flex d-none d-md-block">
        <div class="flex justify-content-between align-items-center">
          <span class="me-3"><label class="fw-normal">Nr.QSO:</label> <label>{{ rows.length }} </label></span>
          <span class="me-3"><label class="fw-normal">{{ $t('migliorDx') }}</label> <label>{{ getDX() }}</label></span>
          <IconField iconPosition="left">
            <InputIcon class="flex align-items-center">
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" :placeholder="$t('ricercaQso')"/>
          </IconField>
        </div>
      </div>
    </template>


    <Column v-if="!hideToolbar" class="border-bottom">
      <template #body="{ data }">
        <button class="btn btn-outline-primary me-2"
                data-bs-target="#dettaglio_qso" data-bs-toggle="modal"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                @click="state.currentQSO = data"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-outline-danger me-2"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                @click="deleteQSO(data)"><i class="fa-solid fa-trash"></i>
        </button>
      </template>
    </Column>

    <Column :header="$t('data')" class="border-bottom d-none d-md-table-cell" field="data" sortable>
      <!--suppress AllyHtmlVueInspection -->
      <template #body="{ data }">
        {{ formatDate((data as BO_qso).data) }}
      </template>
    </Column>

    <Column class="border-bottom" field="time" header="UTC" sortable>

    </Column>

    <Column class="border-bottom" field="call" header="Call">
      <template #body="{ data }">
        <!--suppress AllyHtmlVueInspection -->
        <a class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
           target="_blank" :href="'https://www.qrz.com/db/'+(data as BO_qso).call">
          {{ (data as BO_qso).call }}
        </a>
      </template>

    </Column>

    <Column :header="$t('banda')" class="border-bottom" field="banda_m">
      <template #body="{ data }">
        <!--suppress AllyHtmlVueInspection -->
        <span class="badge p-2 fs-6"
              :style="'background-color:'+getBandMColor((data as BO_qso).banda_m)[1]+';color:'+getBandMColor((data as BO_qso).banda_m)[0]">{{ (data as BO_qso).banda_m }}</span>

      </template>

    </Column>

    <Column :header="$t('modo')" class="border-bottom" field="modo">

    </Column>

    <Column class="border-bottom  d-none d-md-table-cell" field="wwl" header="WWL">
      <!--suppress AllyHtmlVueInspection -->
      <template #body="{ data }">
        {{ (data as BO_qso).wwl }}
      </template>
      <!--      <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                         placeholder="wwl"/>
            </template>-->
    </Column>

    <Column class="border-bottom  d-none d-md-table-cell" field="power" header="W">
      <!--suppress AllyHtmlVueInspection -->
      <template #body="{ data }">
        {{ (data as BO_qso).power }}
      </template>

    </Column>


    <Column class="border-bottom" field="ref" header="Ref.">
      <template #body="{ data }">
        <!--suppress AllyHtmlVueInspection -->
        <div class="text-nowrap">
            {{ (data as BO_qso).ref }}
        </div>
      </template>
    </Column>

    <Column class="border-bottom  d-none d-md-table-cell" field="km" header="QRB" sortable>
      <template #body="{ data }">
        <!--suppress AllyHtmlVueInspection -->
        <span v-if="(data as BO_qso).wwl!=''">{{ (data as BO_qso).km }} Km</span>
      </template>
    </Column>

    <Column v-if="!hideToolbar" class="border-bottom" field="qsl_send" header="">
      <template #header>
        <div class="form-check">
          <input v-model="state.allQSL" class="form-check-input" type="checkbox" @click="toggleQSL">
          <!--suppress AllyHtmlVueInspection -->
          <label class="form-check-label" for="flexCheckDefault">
            QSL
          </label>
        </div>
      </template>
      <template #body="{ data }">
        <div class="form-check">
          <input v-model="(data as BO_qso).qsl_send" class="form-check-input" type="checkbox" @click="resetAllQSO">
        </div>
      </template>
    </Column>

    <Column v-if="!hideQSL &&  !isPrint" class="border-bottom " field="qsl" header="QSL">
      <template #body="{ data }">
        <a :href="'/server/api/Api.php?service=qsl.download&qsoid=' + (data as BO_qso).id + '&uid=' + (data as BO_qso).uid + '&myself=' + (globalState.user.call==(data as BO_qso).call)"
           class="me-2"
           :title="$t('scaricaLaQsl')"
           target="_blank"><i class="fa-regular fa-image"></i></a>
        <i v-if="(data as BO_qso).qsl_sended==0 && !(data as BO_qso).qsl_send" :title="$t('qslDisponibile')" class="fa-regular fa-circle"></i>
        <i v-if="(data as BO_qso).qsl_sended==1 && (data as BO_qso).qsl_send" :title="$t('qslInviata')" class="text-success fa-solid fa-circle"></i>
        <i v-if="(data as BO_qso).qsl_sended==0 && (data as BO_qso).qsl_send" :title="$t('qslInAttesaDiInvio')" class="fa-regular fa-clock"></i>
        <i v-if="(data as BO_qso).qsl_sended==-1" :title="$t('qslNonInviata')" class="fa-solid fa-circle text-danger" style="color:red"></i>
      </template>
    </Column>


  </DataTable>

  <QSO v-model:qso="state.currentQSO" :isNewQSO="state.newQSO" @update:new="addQSO" @update:close="closeQSO"></QSO>


</template>

<style scoped>

</style>