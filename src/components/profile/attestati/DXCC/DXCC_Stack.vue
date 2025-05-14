<script lang="ts" setup>

import {computed, reactive, watch} from "vue";

import DXCC from "./DXCC.vue";
import {responsiveOptions} from "../KnobStatus.ts";
import {BO_dxcc} from "../../../BO/BO_dxcc.ts";

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const props = defineProps({
  dxcc: {
    type: Array as () => BO_dxcc[],
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
    {value: 10, show: true,},
    {value: 50, show: true,},
    {value: 75, show: true,},
    {value: 100, show: true,},
    {value: 120, show: true,},
    {value: 140, show: true,},
    {value: 160, show: true,},
    {value: 180, show: true,},
    {value: 200, show: true,},
    {value: 210, show: true,},
    {value: 220, show: true,},
    {value: 230, show: true,},
    {value: 240, show: true,},
    {value: 250, show: true,},
    {value: 260, show: true,},
    {value: 270, show: true,},
    {value: 280, show: true,},
    {value: 290, show: true,},
    {value: 300, show: true,},
    {value: 310, show: true,},
    {value: 320, show: true,},
    {value: 330, show: true,},
    {value: 340, show: true,}
  ],
})


const levelFiltered = computed(() => {
  return state.levels.filter((item) => {
    return item.show;
  })
})

const checkAtt = () => {
  state.value = props.dxcc?.length;


  state.levels.forEach((item, index) => {
    if (item.value <= state.value) {
      if ((index - 1) >= 0) {
        state.levels[index - 1].show = false;
      }
    }
  })

}

checkAtt();
watch(() => props.dxcc, () => {
  checkAtt();
})

</script>

<template>
  <div class="fs-3">{{ $t('countryCollegati') }}
    <button class="btn" data-bs-target="#detailDXCC" data-bs-toggle="modal" type="button"><i class="text-secondary fs-6 fa-regular fa-circle-question"></i></button>
  </div>

  <div>
    <ProgressBar v-if="!loaded" mode="indeterminate" style="height: 6px"></ProgressBar>
    <Skeleton v-if="!loaded" style="height:10rem;width:100%"></Skeleton>
    <Carousel v-if="loaded && !isMobile" :numScroll="1" :numVisible="6" :responsiveOptions="responsiveOptions" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <DXCC v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></DXCC>
      </template>
    </Carousel>

    <Carousel v-if="loaded && isMobile" :numScroll="1" :numVisible="1" :value="levelFiltered" circular class="m-2">
      <template #item="slotProps">
        <div class="d-flex justify-content-center">
          <DXCC v-if="slotProps.data.show" :max-level="slotProps.data.value" :min-level="(slotProps.index==0 ? 0 : levelFiltered[slotProps.index-1].value)" :value="state.value"></DXCC>
        </div>
      </template>
    </Carousel>
  </div>

  <div id="detailDXCC" class="modal" tabindex="-1">\
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('attestatoQsoInQrp') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>{{ $t('alRaggiungimentoDelleSoglieDi') }}</p>
          <ul>
            <li>{{ $t('Country', {count: 10}) }}</li>
            <li>{{ $t('Country', {count: 50}) }}</li>
            <li>{{ $t('Country', {count: 75}) }}</li>
            <li>{{ $t('Country', {count: 100}) }}</li>
            <li>{{ $t('Country', {count: 120}) }}</li>
            <li>{{ $t('Country', {count: 140}) }}</li>
            <li>{{ $t('Country', {count: 160}) }}</li>
            <li>{{ $t('Country', {count: 180}) }}</li>
            <li>{{ $t('Country', {count: 200}) }}</li>
            <li>{{ $t('Country', {count: 210}) }}</li>
            <li>{{ $t('Country', {count: 220}) }}</li>
            <li>{{ $t('Country', {count: 230}) }}</li>
            <li>{{ $t('Country', {count: 240}) }}</li>
            <li>{{ $t('Country', {count: 250}) }}</li>
            <li>{{ $t('Country', {count: 260}) }}</li>
            <li>{{ $t('Country', {count: 270}) }}</li>
            <li>{{ $t('Country', {count: 280}) }}</li>
            <li>{{ $t('Country', {count: 290}) }}</li>
            <li>{{ $t('Country', {count: 300}) }}</li>
            <li>{{ $t('Country', {count: 310}) }}</li>
            <li>{{ $t('Country', {count: 320}) }}</li>
            <li>{{ $t('Country', {count: 330}) }}</li>
            <li>{{ $t('Country', {count: 340}) }}</li>
          </ul>
          <p>{{ $t('collegatiPotraiScaricareLattestatoDxAward') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>