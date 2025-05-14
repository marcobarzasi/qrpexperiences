<script lang="ts" setup>
import {BO_Activation} from "../../BO/BO_Activation.ts";
import {ref} from "vue";
import GridQSO from "../../GridQSO.vue";
import {BO_qso} from "../../BO/BO_qso.ts";
import moment from "moment";
import LeafletMap from "../../LeafletMap.vue";
import {useSharedLogicLogbook} from "./Logbook.ts";


const attivazione = defineModel<BO_Activation>('value', {required: true});
const qso = defineModel<BO_qso[]>('qso', {required: true});
const emit = defineEmits(['check:logbook'])
const gridQSO = ref();
const mapQSO = ref();


const externalRef = {
  mapQSO,
  gridQSO,
}

const externalModels = {
  attivazione,
  qso,
}

const {
  state,
  onUpload,
  onUploadError,
  checkQSO,
  fillQSO,
  reloadMap,
  resetForm,
  deleteAllQSO,
  setPower,
  resolveAllLocators,
  validation
} = useSharedLogicLogbook(externalRef, externalModels);


defineExpose({
  validation,
  checkQSO
})

</script>

<template>

  <nav class="navbar navbar-light bg-light shadow-1 mt-3 p-3">

    <FileUpload
        :auto="true"
        :url="'/server/api/UploaderLogbook.php?uid='+state.attivazione.uid+'&year='+moment(state.attivazione.data).year()"
        :chooseLabel="$t('CaricaLog')"
        mode="basic"
        name="files"
        @upload="onUpload"
        @upload-error="onUploadError"/>


    <button class="btn btn-secondary p-2" type="button" @click="resetForm()">{{ $t('caricaQsoManualmente') }}</button>
    <button class="btn btn-danger p-2" type="button" @click="deleteAllQSO()">{{ $t('cancellaTuttiIQso') }}</button>
    <button class="btn btn-secondary p-2" type="button" @click="setPower()">{{ $t('impostaPotenza') }}</button>
    <button id="ricercaWWL" :disable="state.wwlSearch" class="btn btn-secondary p-2" type="button" @click="resolveAllLocators()"> {{ $t('cercaWwlMancanti') }}</button>

  </nav>

  <div v-if="state.wwlSearch" class="alert alert-info mt-5" role="info">
    <i class="fa-solid fa-triangle-exclamation"></i> {{ $t('ricercaLocatoriInCorso') }}
  </div>

  <div id="accordionMap" class="accordion pt-4 mb-5" v-if="qso.length>0">
    <div class="accordion-item">
      <h2 id="headingMap" class="accordion-header">
        <button class="accordion-button collapsed " data-bs-target="#collapseMap" data-bs-toggle="collapse" type="button" @click="reloadMap">
          {{ $t('mostraMappaDeiQso') }}
        </button>
      </h2>
      <div id="collapseMap" aria-labelledby="headingMap" class="accordion-collapse collapse" data-bs-parent="#accordionMap">
        <div class="accordion-body">
          <div class="card shadow-1">
            <div class="row p-3">
              <div class="col">
                <!--                <iframe id="qsoMap" src="/map/mapbox_qso_tmp.php" style="width: 100%;height: 600px;"></iframe>-->


                <!--                <MapBox ref="mapQSO" :autoInit="false" :gps="false" :mapWithReferences="false" size="width: 100%;height: 600px;"
                                        uid="mapQSO" @map:ready="fillQSO"
                                ></MapBox>-->
                <LeafletMap ref="mapQSO" :is-embedded="true" size="width: 100%;height: 600px;" @map:ready="fillQSO"></LeafletMap>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GridQSO ref="gridQSO" v-model:value="qso" :hideQSL="true" :show-errors="true" @logbook:check="checkQSO"></GridQSO>

</template>

<style scoped>

</style>