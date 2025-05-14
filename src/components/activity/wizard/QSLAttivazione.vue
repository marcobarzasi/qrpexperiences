<script lang="ts" setup>

import QSL from "../../QSL.vue";
import {BO_Activation} from "../../BO/BO_Activation.ts";
import moment from "moment";
import Field from "../../Field.vue";
import {ref} from "vue";
import {generateUID} from "../../utils.ts";
import {useSharedLogicQSL} from "./QSL.ts";

const attivazione = defineModel<BO_Activation>('value', {required: true});
const emit = defineEmits(['check:logbook'])
const qslCard = ref();

const externalRef = {
  qslCard,
}

const externalModels = {
  attivazione,
}

const {
  state,
  loadQSL,
  selectQSL,
} = useSharedLogicQSL(externalRef, externalModels);

defineExpose({
  loadQSL,
})
</script>

<template>
  <div class="row  pt-4">
    <Field v-model:value="attivazione.qsl_commento"
           @update:validator="qslCard.value.reload()"
           :label="$t('commento')"
           type="text"
    />
  </div>
  <label class="mt-5 mb-2">{{ $t('quiPuoiCaricareUnaQslSpecialePerQuestaAttivazione') }}<br>
    {{ $t('ricordaChePuoiAvereUnaUnaTuaQslPersonalizzataDaUti') }}
    <RouterLink :to="{name:'settings'}" target="_blank">{{ $t('impostazioniDelSito') }}</RouterLink>
    <br>
  </label>
  <hr>
  <div v-if="attivazione.data==''" class="alert alert-warning" role="alert">
    <i class="fa-solid fa-triangle-exclamation"></i> {{ $t('perCaricareUnaQslPersonalizzataNecessarioInserireL') }}
  </div>
  <QSL
      ref="qslCard"
      :call="attivazione.call"
      :enableCustom="attivazione.data!=''"
      :is-activation="true"
      :path="moment(attivazione.data).year()+'/'+attivazione.uid"
      :uid="attivazione.uid"
      :commento="(attivazione.qsl_commento!='' ? attivazione.qsl_commento : ''+attivazione.nome+' - '+attivazione.locatore+' - 73')"
  ></QSL>
  <hr>
  <h2>{{ $t('qslDisponibili') }}</h2>
  <p>{{ $t('puoiSceglierneUnaOppurePersonalizzaraPerQuestaAtti') }}</p>
  <div v-if="attivazione.data==''" class="alert alert-warning" role="alert">
    <i class="fa-solid fa-triangle-exclamation"></i> {{ $t('perScegliereUnaQslNecessarioInserireLaDataDellatti') }}
  </div>
  <div class="grid mt-5">
    <div v-for="(image, index) of state.qsl" :key="index" class="col-2 text-center card m-1">
      <img :alt="image.name" :src="image.name+'?h='+generateUID()" style="cursor: pointer;max-width:200px;"/>
      <div class="mt-2">
        <button :class="'btn btn-'+(attivazione.data=='' ? 'secondary' : 'primary')" :disabled="attivazione.data==''" @click="selectQSL(image)">{{ $t('scegliQsl') }}</button>
      </div>
    </div>
  </div>
  <div style="width:100%;height:50px">

  </div>
</template>

<style scoped>

</style>