<script lang="ts" setup>
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {computed, reactive, ref} from "vue";
import {BO_Activation} from "../BO/BO_Activation.ts";
import {BO_qso} from "../BO/BO_qso.ts";
import {BO_Images} from "../BO/BO_Images.ts";
import {extractVideoID, formatDate, getBandMColor} from "../utils.ts";
/*import MapBox from "../MapBox.vue";*/
import GridQSO from "../GridQSO.vue";
import LiteYouTubeEmbed from 'vue-lite-youtube-embed'

import CallAvatar from "../CallAvatar.vue";
import {useStore} from "../../store/Store.ts";
import MeterGraph from "../MeterGraph.vue";
import {DataMeterGraph} from "../DataMeterGraph.ts";
import LeafletMap from "../LeafletMap.vue";


const globalState = useStore();

const emit = defineEmits(['update:loaded'])

const state = reactive({
  attivazione: new BO_Activation(),
  qso: [] as BO_qso[],
  images: [] as BO_Images[],

  bestDX_KM: 0,
  bestDX_CALL: "",
  oraInizio: "23:59",
  oraFine: "00:00",

  bands: [] as DataMeterGraph[],

  nlike: 0,
  liked: false,
  bookmark: false,

  loaded: false,
  saved: false,
})

const videoID = computed(() => {
  return extractVideoID(state.attivazione.video);
});

const props = defineProps({
  uid: String,
  isPrint: {
    type: Boolean,
    default: false
  }
})

const mapRef = ref();
const qsoMap = ref();
const activeIndex = ref(0);
const displayCustom = ref(false);

const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);

const fillQSO = () => {

  state.qso.forEach((qso) => {
    qsoMap.value.addQSO(qso);
  });
  qsoMap.value.setHome(state.attivazione.latitudine, state.attivazione.longitudine);
  qsoMap.value.fitMapToBounds();
}

const getImagesAtt = () => {
  let dataImg = {
    uid: state.attivazione.uid,
  };
  server.load("attivazioni.getImagesByAtt", dataImg, (response: any) => {
    if (response.success) {
      state.images = response.result.list;
    } else {
      messages.showError(response.error);
    }
  })
}


const imageClick = (index: number) => {
  activeIndex.value = index;
  displayCustom.value = true;
};


const init = () => {
  const uid = props.uid || "";
  state.attivazione.uid = uid;
  server.load("attivazioni.get", {uid: uid}, (response: any) => {

    if (response.success) {
      state.attivazione = response.result.attivazione;
      state.qso = response.result.qso;

      let band = {} as any;


      state.qso.forEach((qso) => {
        if (qso.time < state.oraInizio) {
          state.oraInizio = qso.time;
        } else if (qso.time > state.oraFine) {
          state.oraFine = qso.time;
        }

        if (qso.km > state.bestDX_KM) {
          state.bestDX_KM = qso.km;
          state.bestDX_CALL = qso.call;
        }


        if (band[qso.banda_m] === undefined) {
          band[qso.banda_m] = 1;
        } else {
          band[qso.banda_m]++;
        }

      });

      state.bands = Object.keys(band).map((key) => {
        return {
          label: key,
          color: getBandMColor(key)[1],
          value: band[key],
          perc: Math.ceil(band[key] / state.qso.length * 100),
        };
      });

      state.loaded = true;
      state.saved = true;

      getImagesAtt();
      getLike();
      getBookmark();
      //setTimeout(fillQSO, 1000);
      setTimeout(() => {
        mapRef.value.reload();
        qsoMap.value.reload();
      }, 200);

      setTimeout(maps, 1000);
      emit('update:loaded', state.attivazione);


      if (props.isPrint) {
        setTimeout(() => {
          window.print()
        }, 1000);

      }

    } else {
      messages.showError(response.error);
    }
  })
}

init();

const maps = () => {
  /*  mapRef.value.reload();
    qsoMap.value.reload();*/
  mapRef.value.setPos(state.attivazione.latitudine, state.attivazione.longitudine);
  mapRef.value.centerToLocator(state.attivazione.longitudine, state.attivazione.latitudine);

  //qsoMap.value.reload();
  fillQSO();
}

const getLike = () => {
  server.load("attivazioni.getLike", {uid: state.attivazione.uid, callUser: globalState.user.call}, (response: any) => {
    if (response.success) {
      state.liked = response.result.like;
      state.nlike = response.result.nlike;
    } else {
      messages.showError(response.error);
    }
  });
}

const like = () => {
  const changeTo = !state.liked;
  state.liked = changeTo;
  if (changeTo) {
    state.nlike++;
  } else {
    state.nlike--;
  }


  const data = {
    uid: state.attivazione.uid,
    callUser: globalState.user.call,
    liked: changeTo,
  }
  server.save("attivazioni.like", data, (response: any) => {
    if (response.success) {
      // state.liked = response.result.like;
      // state.nlike = response.result.nlike;
    } else {
      messages.showError(response.error);
    }
  });
}

const bookmark = () => {
  const changeTo = !state.bookmark;
  state.bookmark = changeTo;

  const data = {
    uid: state.attivazione.uid,
    callUser: globalState.user.call,
    bookmark: changeTo,
  }
  server.save("attivazioni.bookmark", data, (response: any) => {
    if (response.success) {
      //state.bookmark = response.result.bookmark;
    } else {
      messages.showError(response.error);
    }
  });
}

const getBookmark = () => {
  server.load("attivazioni.getBookmark", {uid: state.attivazione.uid, callUser: globalState.user.call}, (response: any) => {
    if (response.success) {
      state.bookmark = response.result.bookmark;
    } else {
      messages.showError(response.error);
    }
  });
}


</script>

<template>


  <div v-if="!state.loaded && !isPrint" class="container">
    <Skeleton class="mb-3" height="10rem"></Skeleton>
    <Skeleton class="mb-3" shape="circle" size="5rem"></Skeleton>
    <Skeleton class="mb-3" width="20rem"></Skeleton>
    <Skeleton class="mb-3" width="10rem"></Skeleton>
    <Skeleton class="mb-3" width="5rem"></Skeleton>
  </div>


  <div v-show="state.loaded" :class="(isPrint ? '' : 'container')+' shadow mb-5'">
    <div v-if="!isPrint" class="pt-2">
      <!--      <MapBox ref="mapRef" :auto-init="false" :mapWithReferences="false" :referenceMap="true" size="height:300px" uid="mapRef"></MapBox>-->
      <LeafletMap ref="mapRef" :is-embedded="true" size="height:300px"></LeafletMap>

    </div>
    <div class="mt-3">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center mb-3">
          <CallAvatar :userCall="state.attivazione.operatore"></CallAvatar>
          <!--      <Avatar :label="state.attivazione.call.charAt(0)" class="mr-2" shape="circle" style="background-color: #ece9fc; color: #2a1261"/>-->
          {{ state.attivazione.call }}
        </div>
        <div v-if="!isPrint">
          <button class="btn btn-light m-3" type="button" @click="like"><i :class="'fs-5 text-primary fa-'+(state.liked ? 'solid' : 'regular')+' fa-thumbs-up'"></i> ({{ state.nlike }})</button>
          <button class="btn btn-light m-3" type="button" @click="bookmark"><i :class="'fs-5 text-primary fa-'+(state.bookmark ? 'solid' : 'regular')+' fa-bookmark'"></i></button>
        </div>
      </div>


      <h1>{{ state.attivazione.nome }}</h1>

      <div class="row ">
        <div class="col-sm border-end">
          <i class="fa-regular fa-calendar"></i>
          {{ formatDate(state.attivazione.data) }}
        </div>
        <div class="col-sm border-end">
          <i class="fa-solid fa-map-location"></i>
          {{ state.attivazione.locatore }}
        </div>

        <div class="col-sm border-end">
          <i class="fa-regular fa-clock"></i>
          {{ state.oraInizio }}
          -
          {{ state.oraFine }}
        </div>
        <!--suppress AllyHtmlVueInspection -->
        <div class="col-sm border-end  border-start">
          <i class="fa-solid fa-tower-broadcast"></i> {{ state.qso.length }} QSO
        </div>
        <!--suppress AllyHtmlVueInspection -->
        <div class="col-sm  border-start">
          <i class="fa-solid fa-people-arrows"></i> {{ state.bestDX_KM }} Km ({{ state.bestDX_CALL }})
        </div>

      </div>
      <hr>
    </div>

    <div v-if="state.attivazione.descrizione!=''">
      <div v-html="state.attivazione.descrizione"></div>
      <hr>
    </div>
    <h5>{{ $t('fotoVideo') }}</h5>
    <div class="row ">
      <div class="col ">
        <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :circular="true"
                  :fullScreen="true" :numVisible="7"
                  :responsiveOptions="responsiveOptions" :showItemNavigators="true" :showThumbnails="false"
                  :value="state.images" containerStyle="max-width: 850px">
          <template #item="slotProps">
            <img :alt="slotProps.item.name" :src="slotProps.item.name" style="width: 100%; display: block"/>
          </template>
          <template #thumbnail="slotProps">
            <img :alt="slotProps.item.name" :src="slotProps.item.name" style="display: block"/>
          </template>
        </Galleria>
        <div v-if="state.images" class="grid">
          <div v-for="(image, index) of state.images" :key="index" class="col-3 text-center">
            <img :alt="image.name" :src="image.name" class="img-fluid rounded" style="cursor: pointer;max-height:220px;"
                 @click="imageClick(index)"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="videoID!='' && !isPrint" class="d-flex justify-content-center m-3">
      <div class="w-75 text-center'">
        <LiteYouTubeEmbed
            :id="videoID"
            title=""
        />
      </div>
    </div>
    <hr>
    <div v-if="!isPrint">
      <h5>{{ $t('mappaQso') }}</h5>
      <LeafletMap ref="qsoMap" :is-embedded="true" size="height: 600px"></LeafletMap>
      <hr>
    </div>
    <MeterGraph :label="$t('bandeLavorate')" :values="state.bands"></MeterGraph>
    <hr>
    <!--suppress AllyHtmlVueInspection -->
    <h5>Logbook</h5>
    <GridQSO :hideToolbar="true" :is-print="isPrint" :value="state.qso"></GridQSO>
  </div>
</template>

<style scoped>
.custom-meter {
  height: 40px !important;
}

</style>