<script lang="ts" setup>

import {BO_ActivationRow} from "./BO/BO_ActivationRow.ts";
import {formatDate} from "./utils.ts";
import {reactive, ref} from "vue";
import {FilterMatchMode} from "primevue/api";
import {server} from "./server.ts";
import {messages} from "./messages.ts";
import {router} from "../routes.ts";

const state = reactive({
  attivazioni: [] as BO_ActivationRow[],
  selected: new BO_ActivationRow(),
})

const loading = ref(true);

const props = defineProps({
  q: String,
})

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});


const loadAttivazioni = () => {
  let data = {
    q: props.q,
  };
  server.load("attivazioni.listByQuery", data, (response: any) => {
    if (response.success) {
      state.attivazioni = response.result.list;
    } else {
      messages.showError(response.error);
    }
    loading.value = false;
  })

}
loadAttivazioni();

const open = () => {
  const url = router.resolve({name: 'activity', params: {uid: state.selected.uid}}).href;
  window.open(url, '_blank');
  //router.push({name: 'activity', params: {uid: state.selected.uid}});
}

</script>

<template>
  <div class="container mt-3">
    <h2>{{ $t('risultatiDellaRicerca') }}</h2>
    <DataTable
        ref="dt"
        v-model:filters="filters" v-model:selection="state.selected"
        :globalFilterFields="['nome', 'data', 'wwl']"
        :loading="loading"
        :rows="50" :rowsPerPageOptions="[50, 100, 200]" :value="state.attivazioni"
        data-key="uid"
        paginator removableSort selectionMode="single"
        stripedRows
        @rowSelect="open"
    >
      <template #empty> {{ $t('nessunRisultato') }}</template>
      <template #loading> {{ $t('ricercaIonCorso') }}</template>
      <template #header>
        <div class="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-search"/>
            </InputIcon>
            <InputText v-model="filters['global'].value" :placeholder="$t('cerca')"/>
          </IconField>
        </div>
      </template>

      <Column style="width:1rem">
        <template #body="slotProps">
          <img :src="'/server/api/Api.php?service=attivazioni.thumbnails&uid=' + (slotProps.data as BO_ActivationRow).uid+'&v='+(slotProps.data as BO_ActivationRow).version"
               class="responsive-image rounded" height="80rem"
          />

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
      <Column field="wwl" header="WWL"></Column>
      <Column field="nrQSO" header="QSO" sortable></Column>
      <Column field="bestDX" header="Best DX" sortable>
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