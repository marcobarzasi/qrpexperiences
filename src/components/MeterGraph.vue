<script lang="ts" setup>


import {DataMeterGraph} from "./DataMeterGraph.ts";

defineProps({
  values: {
    type: Array as () => DataMeterGraph[],
    required: true
  },
  label: String,
})
</script>

<template>
  <div>
    <h4>{{ label }}</h4>
    <div class="mb-2 text-nowrap">
        <span v-for="(item) in values" class="me-5">
          <i :style="'color:'+item.color" class="fa-solid fa-circle"></i> <span class="fw-bold">{{ item.label }}</span> - <span>{{ item.perc }}% ({{ item.value }})</span>
        </span>
    </div>

    <div class="progress-stacked" style="height:30px">
      <div v-for="(item) in values" :style="'height:40px;width: '+item.perc+'%'" class="progress" role="progressbar">
        <div :style="'background-color:'+item.color" :title="item.label" class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>