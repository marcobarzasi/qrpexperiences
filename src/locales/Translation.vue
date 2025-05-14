<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import {FilterMatchMode} from "primevue/api";
import {server} from "../components/server.ts";
import {getTranslation} from "../components/translations.ts";


const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});

type LocaleJson = {
  [key: string]: string;
};

type MapType = {
  key: string;
  it: string;
  de: string;
  en: string;
  es: string;
};

const state = reactive({
  rows: [] as MapType[],
  onlyMissing: false,
  it: true,
  en: true,
  de: true,
  es: true,
})

let it_dev: LocaleJson;
let en_dev: LocaleJson;
let de_dev: LocaleJson;
let es_dev: LocaleJson;

const loadTranslation = () => {
  state.rows = [];
  it_dev = getTranslation("it");
  en_dev = getTranslation("en");
  de_dev = getTranslation("de");
  es_dev = getTranslation("es");

  Object.keys(it_dev).forEach((key) => {
    let add = true;
    if (state.onlyMissing) {
      if (
          (it_dev[key] && it_dev[key] !== "") &&
          (en_dev[key] && en_dev[key] !== "") &&
          (es_dev[key] && es_dev[key] !== "") &&
          (de_dev[key] && de_dev[key] !== "")
      ) {
        add = false;
      }
    }

    if (add) {
      state.rows.push({
        key: key,
        it: (it_dev as LocaleJson)[key],
        de: (de_dev as LocaleJson)[key],
        en: (en_dev as LocaleJson)[key],
        es: (es_dev as LocaleJson)[key]
      });
    }

  });
}


onMounted(() => {
  loadTranslation();
});

const onCellEditComplete = (event: any) => {
  let {data, newValue, field} = event;

  if (newValue !== data[field]) {
    data[field] = newValue;
    if (field == 'it') {
      (it_dev as LocaleJson)[data.key] = data.it;
    } else if (field == 'en') {
      (en_dev as LocaleJson)[data.key] = data.en;
    } else if (field == 'de') {
      (de_dev as LocaleJson)[data.key] = data.de;
    } else if (field == 'es') {
      (es_dev as LocaleJson)[data.key] = data.es;
    }

    saveUpdatedJson(field);
  }
};

const saveUpdatedJson = async (field: string) => {

  if (field == 'it') {
    server.save("locale.save", {lang: 'it', translations: JSON.stringify(it_dev)}, () => {
    });
  } else if (field == 'en') {
    server.save("locale.save", {lang: 'en', translations: JSON.stringify(en_dev)}, () => {
    });
  } else if (field == 'de') {
    server.save("locale.save", {lang: 'de', translations: JSON.stringify(de_dev)}, () => {
    });
  } else if (field == 'es') {
    server.save("locale.save", {lang: 'es', translations: JSON.stringify(es_dev)}, () => {
    });
  }

};

watch(() => state.onlyMissing, () => {
  loadTranslation();
})

</script>

<template>
  <div class="d-flex">
    <div class="m-3 d-flex">
      <InputSwitch v-model="state.onlyMissing"/>
      <div class="ms-2">Solo traduzioni mancanti</div>
    </div>
    <div class="m-3 d-flex">
      <InputSwitch v-model="state.it"/>
      <div class="ms-2">Mostra italiano</div>
    </div>
    <div class="m-3 d-flex">
      <InputSwitch v-model="state.en"/>
      <div class="ms-2">Mostra inglese</div>
    </div>
    <div class="m-3 d-flex">
      <InputSwitch v-model="state.de"/>
      <div class="ms-2">Mostra tedesco</div>
    </div>
    <div class="m-3 d-flex">
      <InputSwitch v-model="state.es"/>
      <div class="ms-2">Mostra spagnolo</div>
    </div>
  </div>


  <DataTable v-model:filters="filters" :rows="20"
             :rowsPerPageOptions="[20, 100, 250]"
             :value="state.rows" editMode="cell" paginator
             stripedRows tableStyle="min-width: 50rem"
             @cell-edit-complete="onCellEditComplete">
    <template #header>
      <div class="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon>
            <i class="pi pi-search"/>
          </InputIcon>
          <InputText v-model="filters['global'].value" placeholder=""/>
        </IconField>
      </div>
    </template>
    <Column v-if="state.it" field="it" header="Italiano">
      <template #editor="{ data, field }">
        <Textarea v-model="data[field]" class="w-full" rows="5"/>
      </template>
    </Column>
    <Column v-if="state.de" field="de" header="Tedesco">
      <template #editor="{ data, field }">
        <Textarea v-model="data[field]" class="w-full" rows="5"/>
      </template>
    </Column>
    <Column v-if="state.en" field="en" header="Inglese">
      <template #editor="{ data, field }">
        <Textarea v-model="data[field]" class="w-full" rows="5"/>
      </template>
    </Column>
    <Column v-if="state.es" field="es" header="Spagnolo">
      <template #editor="{ data, field }">
        <Textarea v-model="data[field]" class="w-full" rows="5"/>
      </template>
    </Column>
  </DataTable>
  <div style="height:100px">

  </div>
</template>


<style scoped>

</style>