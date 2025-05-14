<script setup lang="ts">

import {computed, onMounted, reactive} from "vue";
import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {router} from "../../routes.ts";
import ActivityCard from "../activity/ActivityCard.vue";
import moment from "moment";
import {i18n} from "../translations.ts";

const state = reactive({
  attivazioni: [] as BO_ActivationRow[],
  year: '',
  lastYear: moment().year(),
  lang: i18n.global.locale,
})


const loadAttivazioni = () => {
  let data = {
    year: state.year,
  };
  server.load("attivazioni.last", data, (response: any) => {
    if (response.success) {
      state.attivazioni = response.result.list;
      state.lastYear = response.result.last_year;
      //state.attivazioni.push(state.attivazioni[0])
    } else {
      messages.showError(response.error);
    }
  })

}

const years = computed(() => {
  const startYear = state.lastYear;
  const yearList = [];
  for (let year = moment().year(); year >= startYear; year--) {
    yearList.push(year);
  }
  return yearList;
});

const open = (uid: string, event: MouseEvent) => {

  const url = "/activity/" + uid;
  if (event.ctrlKey) {
    window.open(url, "_blank");
  } else {
    router.push({name: 'activity', params: {uid: uid}});
  }
}


onMounted(() => {
  loadAttivazioni();
});

</script>

<template>
  <div class="container mt-3">

    <!--suppress AllyHtmlVueInspection -->
    <h3>Portable Radio Experiences</h3>
    <div class="row">
      <div class="col ">
        <p>
          {{ $t('portableExperiencesUnProgettoCheGratuitamenteDLaPo') }}
        </p>
        <p>
          <button class="btn btn-primary" @click="router.push({name:'rules'})">{{ $t('regolamento') }}</button>
          <button class="btn btn-primary ms-3" @click="router.push({name:'guideline'})">{{ $t('lineeGuida') }}</button>
        </p>

        <div class="card m-3">
          <h5 class="card-header">{{ $t('aggiornamentoSito') }}<span class="badge text-bg-danger float-end">{{ $t('novit') }}</span></h5>

          <div class="card-body">
            <h5 class="card-title"></h5>
            <p class="card-text">
              {{ $t('aggiornamentoSitoChangeLog') }}
            </p>
            <ul>
              <li>{{ $t('sitoMobile') }}</li>
              <li>{{ $t('miglioramentiEsteticiECorrezioniPiccoliBugs') }}</li>
            </ul>
          </div>
        </div>


      </div>

      <div class="col ">
        <img class="responsive-image" src="/images/login2.jpeg">
      </div>
    </div>
    <hr>
    <SelectButton v-model="state.year" :options="years" @click="loadAttivazioni"/>
    <DataView :rows="20" :value="state.attivazioni" data-key="uid" layout="grid" paginator>
      <template #grid="slotProps">
        <div class="grid grid-nogutter">
          <div v-for="(item, index) in slotProps.items" :key="index" class="xs:col-12 md:col-12 lg:col-6 xl:col-4" style="cursor:pointer;" @click="open((item as BO_ActivationRow).uid,$event)">
            <ActivityCard :activity="item as BO_ActivationRow"></ActivityCard>
          </div>
        </div>
      </template>
    </DataView>
  </div>

  <!--  <div class=" bg-secondary bg-gradient text-light " style="z-index:0">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="">Contatti:</div>
            <div class="ms-3"><i class="fa-regular fa-envelope"></i> info@radioexperiences.net</div>
          </div>
          <div class="col">
            <div class="mb-2">
              <RouterLink :to="{name:'privacy'}" class="link-light link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover">Informativa sulla privacy</RouterLink>
            </div>
            <div class="mb-2">
              <RouterLink :to="{name:'termini'}" class="link-light link-offset-2 link-offset-3-hover link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover">Termini del servizio</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>-->
</template>

<style scoped>
.responsive-image {
  max-width: 100%;
  height: auto;
}
</style>