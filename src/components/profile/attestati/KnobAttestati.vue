<script lang="ts" setup>

import {KnobStatus} from "./KnobStatus.ts";

const value = defineModel<number>('value', {required: true});

defineProps({
  value: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  valueColor: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

})


</script>

<template>
  <div style="height:7rem">
    <div v-if="status==KnobStatus.UNKNOW" style="font-size:40pt">
      <i class="mt-5 text-secondary fa-solid fa-question"></i>
    </div>
    <div v-if="status==KnobStatus.WAITING" style="font-size:40pt">
      <i class="text-secondary fa-solid fa-hourglass-half opacity-50"></i>
    </div>
    <div v-if="status==KnobStatus.REACHED" style="font-size:40pt">
      <i class="text-warning fa-solid fa-trophy"></i>
    </div>
    <div v-if="status==KnobStatus.LOADING" style="font-size:50pt">
      <ProgressSpinner animationDuration="1s" fill="var(--surface-ground)"
                       strokeWidth="10" style="width: 80px; height: 80px"/>
    </div>

    <div v-if="status==KnobStatus.SHOW">
      <Knob v-model="value" :max="max" :min="min" :valueColor="valueColor"/>
    </div>
  </div>
</template>

<style scoped>

</style>