<script lang="ts" setup>

import {computed, reactive, watch} from "vue";

import {BO_qrbBand} from "../../../BO/BO_qrbBand.ts";

import {responsiveOptions} from "../KnobStatus.ts";
import {getBandGroup} from "../../../utils.ts";
import AroundWord_HF from "./AroundWord_HF.vue";

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
  levels: [
    {value: 5, show: true,},
    {value: 10, show: true,},
    {value: 15, show: true,},
    {value: 20, show: true,},
    {value: 50, show: true,},
    {value: 75, show: true,},
    {value: 100, show: true,},
    {value: 125, show: true,},
    {value: 150, show: true,},
    {value: 200, show: true,},
    {value: 250, show: true,},
    {value: 500, show: true,},
    {value: 750, show: true,},
    {value: 1000, show: true,},
  ]
})

const levelFiltered = computed(() => {
  return state.levels.filter((item) => {
    return item.show;
  })
})

const checkAtt = () => {
  state.value = 0;
  props.att.forEach((item) => {
    if (getBandGroup(item.band) == "HF") {
      state.value += item.qrb;
    }
  })

  state.value = Math.round(state.value / 40076);

  state.levels.forEach((item, index) => {
    if (item.value <= state.value) {
      if ((index - 1) >= 0) {
        state.levels[index - 1].show = false;
      }
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
  <div class="fs-3">HF Around the World
    <button class="btn" data-bs-target="#detailHF" data-bs-toggle="modal" type="button"><i class="text-secondary fs-6 fa-regular fa-circle-question"></i></button>
  </div>
  <div>
    <ProgressBar v-if="!loaded" mode="indeterminate" style="height: 6px"></ProgressBar>
    <Skeleton v-if="!loaded" style="height:10rem;width:100%"></Skeleton>
    <Carousel v-if="loaded && !isMobile" :numScroll="1" :numVisible="6" :responsiveOptions="responsiveOptions" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <AroundWord_HF v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 :  levelFiltered[slotProps.index-1].value)" :value="state.value"></AroundWord_HF>
      </template>
    </Carousel>

    <Carousel v-if="loaded && isMobile" :numScroll="1" :numVisible="1" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <div class="d-flex justify-content-center">
          <AroundWord_HF v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 :  levelFiltered[slotProps.index-1].value)" :value="state.value"></AroundWord_HF>
        </div>
      </template>
    </Carousel>

  </div>
  <div id="detailHF" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('attestatoHfAroundTheWorld') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('alRaggiungimentoDelleSoglie1GiroDelMondo40076KmDi') }}</p>
          <ul>
            <li>{{ $t('GiriDelMondo', {count: 5}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 10}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 15}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 20}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 50}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 75}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 100}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 125}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 150}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 200}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 250}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 500}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 750}) }}</li>
            <li>{{ $t('GiriDelMondo', {count: 1000}) }}</li>
          </ul>
          <p>{{ $t('fattiInHfPotraiScaricareIlRelativoAttestatoHfAroun') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>