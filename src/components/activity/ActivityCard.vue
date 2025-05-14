<script lang="ts" setup>

import {BO_ActivationRow} from "../BO/BO_ActivationRow.ts";
import {formatDate} from "../utils.ts";

defineProps<{
  activity: BO_ActivationRow;
}>();


</script>

<template>
  <div class="card m-2 p-2">
    <div class="d-flex justify-content-between">
      <div>{{ activity.call }}</div>
      <div v-if="activity.suggest"><i class="text-warning fa-solid fa-star"></i></div>
    </div>
    <div class="text-truncate-2 overflow-hidden" style="height:4.5rem"><h3>{{ activity.nome }}</h3></div>
    <div class="text-body-secondary">
      <!--suppress AllyHtmlVueInspection -->
      <span v-if="activity.isQRP" class="badge text-bg-success">QRP</span>
      {{ formatDate(activity.data) }} | {{ activity.wwl }}
    </div>
    <hr>
    <div class="row text-center">
      <div class="col border-end">
        <div class="row">
          <div class="col-auto ms-3">
            <i class="fa-regular fa-clock"></i>
          </div>
          <div class="col-auto">
            <div>{{ (activity.oraInizio) }}</div>
            <div>{{ (activity.oraFine) }}</div>
          </div>

        </div>
      </div>
      <!--suppress AllyHtmlVueInspection -->
      <div class="col border-end  border-start">
        <i class="fa-solid fa-tower-broadcast"></i> {{ activity.nrQSO }} QSO
      </div>
      <!--suppress AllyHtmlVueInspection -->
      <div class="col  border-start">
        <i class="fa-solid fa-people-arrows"></i> {{ activity.bestDX }} Km
      </div>

    </div>

    <div class="mt-3">
      <img v-show="activity.imageLoaded" :src="'/server/api/Api.php?service=attivazioni.thumbnails&uid=' + activity.uid+'&v='+activity.version"
           class="img-fluid rounded"
           @load="activity.imageLoaded=true"/>
      <skeleton v-show="!activity.imageLoaded" class="img-fluid rounded" height="12.5rem"></skeleton>
    </div>
  </div>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4.5rem; /* Adjust based on your line height */
}
</style>