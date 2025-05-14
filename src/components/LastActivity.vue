<script lang="ts" setup>

import {BO_ActivationRow} from "./BO/BO_ActivationRow.ts";
import {formatDate} from "./utils.ts";
//import {useRouter} from 'vue-router'


//const router = useRouter();
defineProps({
  list: Array,

})


const open = (att: BO_ActivationRow) => {
  window.open('/show/' + att.uid, '_blank')
}
</script>

<template>

  <Carousel :numScroll="4" :numVisible="4" :value="list" circular>
    <template #item="slotProps">

      <div class="card border-white" style="width: 15rem;cursor:pointer" @click="open(slotProps.data.uid)">
        <img src="/images/banner.jpg" class="card-image" />
        <div class="card-img-overlay">
          <!--suppress AllyHtmlVueInspection -->
          <span class="badge text-bg-secondary">PORTABLE</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">{{ slotProps.data.nome }}</h5>
<!--          <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content...</p>-->
          <p class="card-text"><small class="text-body-secondary">{{ slotProps.data.call }} | {{ formatDate(slotProps.data.data) }}</small></p>
        </div>
      </div>

<!--      <Card class="p-0 m-3 shadow-2" style="height:20rem; width: 15rem; overflow: hidden;cursor:pointer"
            @click="open(slotProps.data)">
        <template #header>
          <div style="height:8rem; width: 15rem; overflow: hidden">
            <Skeleton v-if="slotProps.data.thumbLoading===undefined" class=" p-3 shadow-1" height="330px"
                      width="529px"></Skeleton>
            <img v-show="slotProps.data.thumbLoading"
                 :src="'/server/api/Api.php?service=attivazioni.thumbnails&uid=' + slotProps.data.uid"
                 style="height: 10rem" @load="slotProps.data.thumbLoading=true"/>
          </div>
        </template>
        <template #title>
          <div class="clip">{{ slotProps.data.nome }}</div>
        </template>
        <template #subtitle>{{ slotProps.data.ref }}</template>
        <template #content>
          <div style="font-size:13px">{{ slotProps.data.call }} | {{ formatDate(slotProps.data.data) }}</div>
        </template>
      </Card>-->

    </template>
  </Carousel>

</template>

<style scoped>
.clip {
  display: -webkit-box;
  /*max-width: 200px;*/
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>