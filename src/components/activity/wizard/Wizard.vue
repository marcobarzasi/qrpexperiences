<!--suppress ALL -->
<script setup lang="ts">

import {ref} from "vue";
import LogBook from "./LogBook.vue";
import Info from "./Info.vue";
import Foto from "./Foto.vue";
import Racconto from "./Racconto.vue";
import QSLAttivazione from "./QSLAttivazione.vue";
import {StatusAttivazione} from "../../BO/StatusAttivazione.ts";
import {Props, useSharedLogicWizard} from "./Wizard.ts";

const props = defineProps<Props>()

const logbook = ref();
const foto = ref();
const info = ref();
const racconto = ref();
const qsl = ref();
const externalRef = {
  logbook,
  foto,
  info,
  racconto,
  qsl,
}

const {
  state,
  active,
  save,
  close,
  checkLogbook,
  infoShow,

} = useSharedLogicWizard(props, externalRef);

</script>

<template>
  <div class="container">
    <div v-if="!state.loaded" class="text-end mt-5 ">
      <Skeleton class="me-3 " height="3rem" width="100%"></Skeleton>
    </div>

    <div v-if="state.loaded" class="text-end mt-5">
      <button class="btn btn-success me-3" @click="save"><i class="fa-solid fa-floppy-disk"></i> {{ $t('salva') }}</button>
      <button class="btn btn-secondary me-3" @click="close">{{ $t('chiudi') }}</button>
    </div>


    <Stepper v-model:activeStep="active">
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
          <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="clickCallback">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-solid fa-rectangle-list"></i>
                </span>
            LogBook
            </button>
          </div>
        </template>
        <template #content="{  }">
          <div class="flex flex-column border-top mt-3 pt-3">
            <h3>{{ $t('caricaIlTuoLogbook') }}</h3>
            <LogBook ref="logbook" v-model:qso="state.qso" v-model:value="state.attivazione"></LogBook>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
            <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="infoShow(clickCallback)">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-solid fa-location-dot"></i>
                </span>
              {{ $t('info') }}
            </button>
          </div>
        </template>
        <template #content="{  }">
          <div class="flex flex-column  border-top mt-3 pt-3">
            <h3>{{ $t('infoSullattivit') }}</h3>
            <Info ref="info" v-model:value="state.attivazione" @check:logbook="checkLogbook()"></Info>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
            <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="clickCallback">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-regular fa-file-lines"></i>
                </span>
              {{ $t('descrizione') }}
            </button>
          </div>
        </template>
        <template #content="{ }">
          <div class="flex flex-column   border-top mt-3 pt-3">
            <h3>{{ $t('breveDescrizione') }}</h3>
            <Racconto ref="racconto" v-model:value="state.attivazione"></Racconto>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
            <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="clickCallback">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-solid fa-camera"></i>
                </span>
              {{ $t('fotoVideo') }}
            </button>
          </div>
        </template>
        <template #content="{ }">
          <div class="flex flex-column   border-top mt-3 pt-3">
            <Foto ref = "foto" v-model:value="state.attivazione"></Foto>
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
            <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="clickCallback">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-solid fa-stamp"></i>
                </span>
              QSL
            </button>
          </div>
        </template>
        <template #content="{  }">
          <div class="flex flex-column   border-top mt-3 pt-3">
            <h3>QSL</h3>
            <QSLAttivazione ref="qsl" v-model:value="state.attivazione"></QSLAttivazione>
          </div>
        </template>
      </StepperPanel>

      <StepperPanel>
        <template #header="{ index, clickCallback }">
          <div>
            <button class="bg-transparent border-none inline-flex flex-column gap-2 align-items-center" @click="clickCallback">
                <span :class="['border-circle border-2 w-3rem h-3rem inline-flex align-items-center justify-content-center', { 'bg-primary border-primary': index <= active, 'surface-border': index > active }]">
                   <i class="fa-solid fa-eye"></i>
                </span>
              {{ $t('visibilit') }}
            </button>
          </div>
        </template>
        <template #content="{  }">
          <div class="">
            <div class="card p-3 m-3">
              <div class="form-check d-flex align-items-center">
                <input id="private" v-model="state.attivazione.status" :value="StatusAttivazione.PRIVATA" class="form-check-input" name="share" type="radio">
                <label class="form-check-label fw-bold fs-5 ms-3" for="private"><i class="fa-solid fa-lock"></i> {{ $t('soloIo') }}</label>
              </div>
              <div class="ms-5">
                <p>{{ $t('lattivitSarVisibileSoloATe') }}<br>
                  {{ $t('sarConteggiataNelleStatisticheMaNonContribuirAllot') }}</p>
              </div>
            </div>
            <div class="card p-3 m-3">
              <div class="form-check d-flex align-items-center">
                <input id="public" v-model="state.attivazione.status" :value="StatusAttivazione.PUBBLICA" class="form-check-input" name="share" type="radio">
                <label class="form-check-label fw-bold fs-5 ms-3" for="public"><i class="fa-solid fa-globe"></i> {{ $t('tutti') }}</label>
              </div>
              <div class="ms-5">
                <p>{{ $t('lattivitSarVisibileATutti') }}<br>
                  {{ $t('contribuirAllottenimentoDegliAttestati') }}</p>
              </div>
            </div>
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </div>

</template>

<style scoped>
.responsive-image {
  max-width: 100%;
  height: auto;
}
</style>