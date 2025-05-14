<script lang="ts" setup>

import {computed, reactive, watch} from "vue";

import {BO_qrbBand} from "../../../BO/BO_qrbBand.ts";
import QRB_VHF from "./QRB_VHF.vue";
import {responsiveOptions} from "../KnobStatus.ts";
import {getBandGroup} from "../../../utils.ts";

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const props = defineProps({
  att: {
    type: Array as () => BO_qrbBand[],
    required: true
  },
  loaded: {
    type: Boolean,
    required: true
  },

})

const state = reactive({
  value: 0,
  levels: [{value: 5 * 1000, show: true,},
    {value: 10 * 10000, show: true,},
    {value: 15 * 1000, show: true,},
    {value: 20 * 1000, show: true,},
    {value: 25 * 1000, show: true,},
    {value: 50 * 1000, show: true,},
    {value: 75 * 1000, show: true,},
    {value: 100 * 1000, show: true,},
    {value: 125 * 1000, show: true,},
    {value: 150 * 1000, show: true,},
    {value: 200 * 1000, show: true,},
    {value: 250 * 1000, show: true,},
    {value: 300 * 1000, show: true,},
    {value: 350 * 1000, show: true,},
    {value: 400 * 1000, show: true,},
    {value: 500 * 1000, show: true,},
    {value: 600 * 1000, show: true,},
    {value: 700 * 1000, show: true,},
    {value: 800 * 1000, show: true,},
    {value: 900 * 1000, show: true,},
    {value: 1000 * 1000, show: true,},
  ],
})

const levelFiltered = computed(() => {
  return state.levels.filter((item) => {
    return item.show;
  })
})

const checkAtt = () => {
  state.value = 0;
  props.att.forEach((item) => {
    if (getBandGroup(item.band) == "VHF") {
      state.value += item.qrb;
    }
  })

  state.levels.forEach((item, index) => {
    if (item.value <= state.value) {
      if ((index - 1) >= 0) {
        state.levels[index - 1].show = false;
      }
      //state.levels[index-2].show = false;
      //item.show = false;
    }
  })

}

checkAtt();
watch(() => props.att, () => {
  checkAtt();
})

</script>

<template>
  <!--suppress AllyHtmlVueInspection -->
  <div class="fs-3">
    {{ $t('QRB in VHF') }}
    <button class="btn" data-bs-target="#detailVHF" data-bs-toggle="modal" type="button"><i class="text-secondary fs-6 fa-regular fa-circle-question"></i></button>
  </div>

  <div>
    <ProgressBar v-if="!loaded" mode="indeterminate" style="height: 6px"></ProgressBar>
    <Skeleton v-if="!loaded" style="height:10rem;width:100%"></Skeleton>

    <Carousel v-if="loaded && !isMobile" :numScroll="1" :numVisible="1" :responsiveOptions="responsiveOptions" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <QRB_VHF v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></QRB_VHF>
      </template>
    </Carousel>

    <Carousel v-if="loaded && isMobile" :numScroll="1" :numVisible="1" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <div class="d-flex justify-content-center">
          <QRB_VHF v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></QRB_VHF>
        </div>
      </template>
    </Carousel>

  </div>

  <div id="detailVHF" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('attestatoQrbInVhf') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('alRaggiungimentoDelleSoglieDi') }}</p>
          <ul>
            <!--suppress AllyHtmlVueInspection -->
            <li>5.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>10.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>15.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>20.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>25.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>50.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>75.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>100.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>125.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>150.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>200.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>250.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>300.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>350.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>400.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>500.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>600.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>700.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>800.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>900.000 Km</li>
            <!--suppress AllyHtmlVueInspection -->
            <li>1.000.000 Km</li>
          </ul>
          <p>{{ $t('fattiInVhfPotraiScaricareLattestatoQrbInVhf') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>