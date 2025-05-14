<script lang="ts" setup>

import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";
import {formatDate} from "../utils.ts";
import {useStore} from "../../store/Store.ts";
import {onMounted, reactive, ref, watch} from "vue";
import {server} from "../server.ts";

import {messages} from "../messages.ts";
import {router} from "../../routes.ts";
import {FilterMatchMode} from "primevue/api";


const globalState = useStore();
const state = reactive({
  attivazioni: [] as BO_ActivationRow[],
  // selected: new BO_ActivationRow(),
})

const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const loadAttivazioni = () => {

  let data = {
    call: globalState.user.call,
  };
  server.load("attivazioni.listBookmark", data, (response: any) => {
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

const bookmark = (item: BO_ActivationRow) => {
  if (event) {
    event.stopPropagation();
  }

  const data = {
    uid: item.uid,
    callUser: globalState.user.call,
    bookmark: false,
  }
  server.load("attivazioni.bookmark", data, (response: any) => {
    if (response.success) {
      loadAttivazioni();
    } else {
      messages.showError(response.error);
    }
  });
}

watch(() => globalState.user.call, (newVal, oldVal) => {
  if (newVal != oldVal) {
    loadAttivazioni();
  }
})

/*
watch(state, () => {
  console.log(state);
});
*/

onMounted(() => {
  loadAttivazioni();
});

</script>

<template>
  <div class="container mt-3">
    <h2>{{ $t('leAttivitPreferite') }}</h2>
    <DataTable
        ref="dt"
        v-model:filters="filters"
        :rows="50"
        :rowsPerPageOptions="[50, 100, 200]" :value="state.attivazioni" data-key="uid"
        paginator
        stripedRows
    >
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
      <Column style="width:7rem">
        <template #body="slotProps">
          <button :title="$t('rimuoviDaiPreferiti')"
                  style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                  class="btn btn-outline-danger me-2"
                  @click="bookmark(slotProps.data)"><i class="fa-solid fa-xmark"></i>
          </button>
          <button :title="$t('apri')"
                  class="btn btn-outline-primary me-2"
                  style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                  @click="open(slotProps.data,$event)"><i class="fa-solid fa-book-open"></i>
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
      <Column :header="$t('data')" field="data">
        <!--suppress AllyHtmlVueInspection -->
        <template #body="slotProps">
          {{ formatDate((slotProps.data as BO_ActivationRow).data) }}
          <div class="text-nowrap"><!--suppress AllyHtmlVueInspection -->
            <h3>{{ (slotProps.data as BO_ActivationRow).nome }}</h3></div>
        </template>
      </Column>
      <Column :header="$t('locatore')" field="wwl"></Column>
      <Column field="nrQSO" header="QSO"></Column>
      <Column :header="$t('bestDx')" field="bestDX">
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