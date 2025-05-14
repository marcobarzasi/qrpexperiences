<script lang="ts" setup>

import {computed, reactive, watch} from "vue";

import QSO from "./QSO.vue";
import {BO_qso} from "../../../BO/BO_qso.ts";
import {responsiveOptions} from "../KnobStatus.ts";

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const props = defineProps({
  qso: {
    type: Array as () => BO_qso[],
    required: true
  },
  loaded: {
    type: Boolean,
    required: true
  },

})

const state = reactive({
  value: 0,
  levels: [
    {value: 100, show: true,},
    {value: 200, show: true,},
    {value: 300, show: true,},
    {value: 500, show: true,},
    {value: 700, show: true,},
    {value: 1000, show: true,},
    {value: 1250, show: true,},
    {value: 1500, show: true,},
    {value: 2000, show: true,},
    {value: 2250, show: true,},
    {value: 2500, show: true,},
    {value: 2750, show: true,},
    {value: 3000, show: true,},
    {value: 3500, show: true,},
    {value: 4000, show: true,},
    {value: 4500, show: true,},
    {value: 5000, show: true,},


  ],
})

const levelFiltered = computed(() => {
  return state.levels.filter((item) => {
    return item.show;
  })
})

const checkAtt = () => {
  state.value = props.qso?.length;

  state.levels.forEach((item, index) => {
    if (item.value <= state.value) {
      if ((index - 1) >= 0) {
        state.levels[index - 1].show = false;
      }
    }
  })

}

checkAtt();
watch(() => props.qso, () => {
  checkAtt();
})




</script>

<template>
  <!--suppress AllyHtmlVueInspection -->
  <div class="fs-3">QSO
    <button class="btn" data-bs-target="#detail" data-bs-toggle="modal" type="button"><i class="text-secondary fs-6 fa-regular fa-circle-question"></i></button>
  </div>
  <div>
    <ProgressBar v-if="!loaded" mode="indeterminate" style="height: 6px"></ProgressBar>
    <Skeleton v-if="!loaded" style="height:10rem;width:100%"></Skeleton>
    <Carousel v-if="loaded && !isMobile" :numScroll="1" :numVisible="6" :responsiveOptions="responsiveOptions" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">

        <QSO v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></QSO>
      </template>
    </Carousel>

    <Carousel v-if="loaded && isMobile" :numScroll="1" :numVisible="1" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <div class="d-flex justify-content-center">
          <QSO v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></QSO>
        </div>
      </template>
    </Carousel>
  </div>

  <div id="detail" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('attestatoQso') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('alRaggiungimentoDelleSoglieDi') }}</p>
          <ul>
            <!--suppress AllyHtmlVueInspection -->
            <li>100 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>200 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>300 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>500 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>700 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>1000 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>1250 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>1500 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>2000 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>2250 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>2500 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>2750 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>3000 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>3500 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>4000 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>4500 QSO</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>5000 QSO</li>
          </ul>
          <p>{{ $t('potraiScaricareLattestatoQsoAward') }}</p>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>