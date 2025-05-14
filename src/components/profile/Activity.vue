<script lang="ts" setup>

import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";
import {useStore} from "../../store/Store.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {server} from "../server.ts";

import {messages} from "../messages.ts";
import {router} from "../../routes.ts";
import {FilterMatchMode} from "primevue/api";
import {StatusAttivazione} from "../BO/StatusAttivazione.ts";
import {formatDate} from "compatx";

const globalState = useStore();
const state = reactive({
  attivazioni: [] as BO_ActivationRow[],
  selected: new BO_ActivationRow(),
})

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const loadAttivazioni = () => {
  let data = {
    call: globalState.user.call,
  };
  server.load("attivazioni.listByCall", data, (response: any) => {
    if (response.success) {
      state.attivazioni = response.result.list;
    } else {
      messages.showError(response.error);
    }
  })
}

const open = (item: BO_ActivationRow, event: MouseEvent) => {
  const url = "/activity/" + item.uid;
  if (event.ctrlKey) {
    window.open(url, "_blank");
  } else {
    router.push({name: 'activity', params: {uid: item.uid}});
  }
}


const remove = (item: BO_ActivationRow) => {
  messages.confirm("Sicuro di voler eliminare questa attivazione?", () => {
    let data = {
      uid: item.uid
    };
    server.save("attivazioni.delete", data, (response: any) => {
      if (response.success) {
        loadAttivazioni();
      } else {
        messages.showError(response.error);
      }
    })
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


  <DataTable
                ref="dt"
                v-model:filters="filters" v-model:selection="state.selected"
                :globalFilterFields="['nome', 'data', 'wwl']"
                :rows="50"
                :rowsPerPageOptions="[50, 100, 200]" :value="state.attivazioni" data-key="uid"
                paginator
                removableSort selectionMode="single" stripedRows

            >
              <template #header>
                <div class="flex justify-content-end">
                  <IconField iconPosition="left">
                    <InputIcon>
                      <i class="pi pi-search"/>
                    </InputIcon>
                    <InputText v-model="filters['global'].value" :placeholder="$t('keywordSearch')"/>
                  </IconField>
                </div>
              </template>
              <Column style="width:7rem">
                <template #body="slotProps">
                  <button class="btn btn-outline-primary me-2"
                          style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                          @click="open(slotProps.data,$event)"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-outline-danger me-2"
                          style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                          @click="remove(slotProps.data)"><i class="fa-solid fa-trash"></i>
                  </button>
                </template>
              </Column>
              <Column style="width:1rem">
                <template #body="slotProps">
                  <img :src="'/server/api/Api.php?service=attivazioni.thumbnails&size=small&uid=' + (slotProps.data as BO_ActivationRow).uid+'&v='+(slotProps.data as BO_ActivationRow).version"
                       class="responsive-image rounded" height="80rem"
                  />

                </template>
              </Column>
              <Column field="status" header="" style="width:1rem">
                <template #body="slotProps">
           <span v-if="(slotProps.data as BO_ActivationRow).status==StatusAttivazione.PRIVATA" :title="$t('privata')">
            <i class="fa-solid fa-lock"></i></span>
                  <span v-if="(slotProps.data as BO_ActivationRow).status==StatusAttivazione.PUBBLICA" :title="$t('pubblica')">
            <i class="fa-solid fa-globe"></i></span>
                </template>
              </Column>
    <Column :header="$t('data')" field="data" sortable>
                <!--suppress AllyHtmlVueInspection -->
                <template #body="slotProps">
                  {{ formatDate((slotProps.data as BO_ActivationRow).data) }}
                  <div class="text-nowrap"><!--suppress AllyHtmlVueInspection -->
                    <h3>{{ (slotProps.data as BO_ActivationRow).nome }}</h3></div>
                </template>
              </Column>
    <Column :header="$t('locatore')" field="wwl"></Column>
              <Column field="nrQSO" header="QSO" sortable></Column>
    <Column :header="$t('bestDx')" field="bestDX" sortable>
                <!--suppress AllyHtmlVueInspection -->
                <template #body="slotProps">
                  {{ (slotProps.data as BO_ActivationRow).bestDX }} Km
                </template>
              </Column>
            </DataTable>

  </div>
</template>

<style scoped>

</style>