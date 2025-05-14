<script lang="ts" setup>
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {computed, reactive, ref} from "vue";
import {BO_User} from "../BO/BO_User.ts";
import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";
import {formatDate, getBandMColor} from "../utils.ts";
import {router} from "../../routes.ts";
import {BO_qso} from "../BO/BO_qso.ts";
import ActivityCard from "../activity/ActivityCard.vue";


const props = defineProps({
  id: String,
})

const loading = ref(false);

const state = reactive({
  user: new BO_User(),
  attivazioni: [] as BO_ActivationRow[],
  qso: [] as BO_qso[],
  callQSO: "",
  showQSOSearchGrid: false,
  loaded: false,
})

const open = (uid: string) => {
  router.push({name: 'activity', params: {uid: uid}});
}

const loadUser = () => {

  let data = {
    userCall: props.id,
  };
  server.load("user.getInfo", data, (response: any) => {
    if (response.success) {
      state.user = response.result.userInfo;
      let data2 = {
        call: props.id,
      };
      server.load("attivazioni.listByCall", data2, (response: any) => {
        if (response.success) {
          state.attivazioni = response.result.list;
          state.loaded = true;
        } else {
          messages.showError(response.error);
        }
      })
    } else {
      messages.showError(response.error);
    }
  })


}

const searchQSO = () => {
  if (state.callQSO == "") {
    state.showQSOSearchGrid = false;
    return;
  }


  loading.value = true;
  let data = {
    call: state.callQSO,
  };
  server.load("attivazioni.getQSOByCall", data, (response: any) => {
    loading.value = false;
    if (response.success) {
      state.qso = response.result.qso;
      state.showQSOSearchGrid = true;
    } else {
      messages.showError(response.error);
    }
  })
}


const showGrid = computed(() => {
  if (state.callQSO == "") {
    state.showQSOSearchGrid = false;
  }
  return state.showQSOSearchGrid;
})

const getLuogo = (uid: string) => {
  let att = state.attivazioni.find((a) => a.uid == uid);
  if (att) {
    return att.nome;
  }
  return "";
}

loadUser();
</script>

<template>
  <div class="container mt-3">
    <div v-if="!state.loaded" class="row ">
      <div class="col-auto">
        <Skeleton height="10rem" width="10rem"></Skeleton>
      </div>
      <div class="col">
        <Skeleton class="m-3" height="2rem" width="20rem"></Skeleton>
        <Skeleton class="m-3" height="2rem" width="14rem"></Skeleton>
        <Skeleton class="m-3" height="2rem" width="18rem"></Skeleton>
      </div>
    </div>

    <div v-if="state.loaded" class="row ">
      <div class="col-auto p-2 text-center mb-5">
        <div id="image-container">
          <img :src="state.user.image" class="img-thumbnail" style="width: 260px">
        </div>
        <div class="fw-bold fs-1">{{ state.user.call }}</div>
        {{ state.user.nome }} {{ state.user.cognome }}<br>
      </div>
      <div class="col">
        <div v-if="state.user.bio!=''" class="card p-2 bg-light" v-html="state.user.bio">

        </div>
        <div class="card mt-3 p-2 shadow-1">
          <div class="d-flex align-items-center">
            <!--          <div class="text-nowrap me-2">{{ $t('ricercaQso') }}:</div>-->
            <input v-model="state.callQSO" :placeholder="$t('scriviIlCallDaCercare')" class="form-control" style="" type="text">
          <button class="ms-2 btn btn-outline-primary" @click="searchQSO">{{ $t('cerca') }}</button>
        </div>
          <hr v-if="showGrid">
        <DataTable
            v-if="showGrid"
            ref="dt"
            :loading="loading"
            :rows="10"
            :rowsPerPageOptions="[10,20, 50]"
            :value="state.qso" class="mt-1" data-key="uid_attivazione"
            paginator
            stripedRows
        >
          <template #empty> {{ $t('nessunQsoTrovato') }}</template>
          <template #loading> {{ $t('ricercaQsoInCorsoAttendere') }}</template>
          <Column class="border-bottom" header="Data">
            <!--suppress AllyHtmlVueInspection -->
            <template #body="slotProps">
              {{ formatDate((slotProps.data as BO_qso).data) }}
            </template>
          </Column>
          <Column class="border-bottom" field="time" header="Ora">
          </Column>
          <Column class="border-bottom" field="call" header="Call"></Column>
          <Column class="border-bottom" field="banda" header="Banda">
            <template #body="{ data }">
              <!--suppress AllyHtmlVueInspection -->
              <span :style="'background-color:'+getBandMColor((data as BO_qso).banda_m)[1]+';color:'+getBandMColor((data as BO_qso).banda_m)[0]"
              class="badge p-2 fs-6">{{ (data as BO_qso).banda_m }}</span>

            </template>
          </Column>

          <Column class="border-bottom" field="wwl" header="Locatore"></Column>
          <Column class="border-bottom" field="modo" header="Modo"></Column>
          <Column class="border-bottom" header="Luogo">
            <!--suppress AllyHtmlVueInspection -->
            <template #body="{ data }">
              {{ getLuogo((data as BO_qso).uid) }}
            </template>
          </Column>
          <Column class="border-bottom" field="qsl" header="QSL">
            <template #body="{ data }">
              <a :href="'/server/api/Api.php?service=qsl.download&qsoid=' + (data as BO_qso).id + '&uid=' + (data as BO_qso).uid + '&myself=false'"
                 class="me-2"
                 target="_blank"
                 :title="$t('scaricaLaQsl')"><i class="fa-regular fa-image"></i></a>
              <i v-if="(data as BO_qso).qsl_sended==1" class="fa-solid fa-check text-success"></i>
              <i v-if="(data as BO_qso).qsl_sended==-1" class="fa-solid fa-xmark text-danger" style="color:red"></i>
            </template>
          </Column>

        </DataTable>
        </div>

        <hr>
        <h3>{{ $t('attivitRecenti') }}</h3>
        <DataView :rows="10" :value="state.attivazioni" data-key="uid" layout="grid" paginator>
          <template #grid="slotProps">
            <div class="grid grid-nogutter ">
              <div v-for="(item, index) in slotProps.items" :key="index" class="xs:col-12 md:col-12 lg:col-6 xl:col-4" style="cursor:pointer;" @click="open((item as BO_ActivationRow).uid)">
                <ActivityCard :activity="item"></ActivityCard>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>

  </div>


</template>

<style scoped>

</style>