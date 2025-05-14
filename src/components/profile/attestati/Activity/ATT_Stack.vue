<script lang="ts" setup>

import {computed, reactive, watch} from "vue";

import ATT from "./ATT.vue";
import {responsiveOptions} from "../KnobStatus.ts";
import {BO_ActivationRow} from "../../../BO/BO_ActivationRow.ts";

import {StatusAttivazione} from "../../../BO/StatusAttivazione.ts";


const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const props = defineProps({
  att: {
    type: Array as () => BO_ActivationRow[],
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
    {value: 25, show: true,},
    {value: 50, show: true,},
    {value: 75, show: true,},
    {value: 100, show: true,},
    {value: 125, show: true,},
    {value: 150, show: true,},
    {value: 175, show: true,},
    {value: 200, show: true,},
    {value: 225, show: true,},
    {value: 250, show: true,},
    {value: 275, show: true,},
    {value: 300, show: true,},
    {value: 350, show: true,},
    {value: 400, show: true,},
    {value: 450, show: true,},
    {value: 500, show: true,},

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
    if (item.status == StatusAttivazione.PUBBLICA) {
      state.value++;
    }
  })

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
  <div class="fs-3">{{ $t('attivitCondivise') }}
    <button class="btn" data-bs-target="#detailATT" data-bs-toggle="modal" type="button"><i class="text-secondary fs-6 fa-regular fa-circle-question"></i></button>
  </div>

  <div>
    <ProgressBar v-if="!loaded" mode="indeterminate" style="height: 6px"></ProgressBar>
    <Skeleton v-if="!loaded" style="height:10rem;width:100%"></Skeleton>
    <Carousel v-if="loaded && !isMobile" :numScroll="1" :numVisible="6" :responsiveOptions="responsiveOptions" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <ATT v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></ATT>
      </template>
    </Carousel>
    <Carousel v-if="loaded && isMobile" :numScroll="1" :numVisible="1" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <div class="d-flex justify-content-center">
          <ATT v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></ATT>
        </div>
      </template>
    </Carousel>
  </div>

  <div id="detailATT" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('attestatoQsoInQrp') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('alRaggiungimentoDelleSoglieDi') }}</p>
          <ul>
            <li>{{ $t('Attivit', {count: 5}) }}</li>
            <li>{{ $t('Attivit', {count: 10}) }}</li>
            <li>{{ $t('Attivit', {count: 20}) }}</li>
            <li>{{ $t('Attivit', {count: 25}) }}</li>
            <li>{{ $t('Attivit', {count: 50}) }}</li>
            <li>{{ $t('Attivit', {count: 75}) }}</li>
            <li>{{ $t('Attivit', {count: 100}) }}</li>
            <li>{{ $t('Attivit', {count: 125}) }}</li>
            <li>{{ $t('Attivit', {count: 150}) }}</li>
            <li>{{ $t('Attivit', {count: 175}) }}</li>
            <li>{{ $t('Attivit', {count: 200}) }}</li>
            <li>{{ $t('Attivit', {count: 225}) }}</li>
            <li>{{ $t('Attivit', {count: 250}) }}</li>
            <li>{{ $t('Attivit', {count: 275}) }}</li>
            <li>{{ $t('Attivit', {count: 300}) }}</li>
            <li>{{ $t('Attivit', {count: 350}) }}</li>
            <li>{{ $t('Attivit', {count: 400}) }}</li>
            <li>{{ $t('Attivit', {count: 450}) }}</li>
            <li>{{ $t('Attivit', {count: 500}) }}</li>
          </ul>
          <p>{{ $t('condiviseConNoiPotraiScaricareLattestatoActivityAw') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>