<script lang="ts" setup>
import {ref} from "vue";

import {BO_Activation} from "../../BO/BO_Activation.ts";
import Field from "../../Field.vue";
import {useStore} from '../../../store/Store.ts'
import LeafletMap from "../../LeafletMap.vue";
import {useSharedLogicInfo} from "./Info.ts";

const globalState = useStore();
const attivazione = defineModel<BO_Activation>('value', {required: true});
const emit = defineEmits(['check:logbook'])
const mapPos = ref();

const externalRef = {
  mapPos,
}

const externalEmitters = {
  emit,
}

const externalModels = {
  attivazione,
}

const {
  state,
  fieldsStatus,
  validation,
  validateCall,
  validateOperatore,
  validateData,
  validateEMail,
  validateLatitudine,
  validateLongitudine,
  validatelocatore,
  setPositionFromMap,
  calcPosition,
  show
} = useSharedLogicInfo(externalRef, externalEmitters, externalModels);


defineExpose({
  validation,
  calcPosition,
  show
})
</script>

<template>
  <div class="row ">
    <div class="col">
      <!--suppress AllyHtmlVueInspection -->
      <Field v-model:value="state.att.call"
             :error="fieldsStatus.call.error"
             :status="fieldsStatus.call.status"
             label="Call"
             type="text"
             @update:validator="validateCall()"/>
    </div>
    <div class="col">
      <Field v-model:value="state.att.operatore"
             :error="fieldsStatus.operatore.error"
             :read-only="globalState.user.role!='MANAGER'"
             :status="fieldsStatus.operatore.status"
             :label="$t('operatore')"
             type="text"
             @update:validator="validateOperatore()"/>
    </div>
    <div class="col">
      <Field v-model:value="state.att.data"
             :error="fieldsStatus.data.error"
             :status="fieldsStatus.data.status"
             :label="$t('data')"
             type="date"
             @update:validator="validateData()"/>
    </div>
  </div>

  <div class="row  ">
    <div class="col">
      <Field v-model:value="state.att.email"
             :error="fieldsStatus.email.error"
             :status="fieldsStatus.email.status"
             label="eMail"
             type="eMail"
             @update:validator="validateEMail()"/>
    </div>
  </div>


  <div class="row border-bottom mt-5">
    <h3>{{ $t('posizione') }}</h3>
  </div>
  <div class="row   ">
    <div class="col">
      <Field v-model:value="state.att.nome"
             :error="fieldsStatus.nome.error"
             :status="fieldsStatus.nome.status"
             :label="$t('nomeDelLuogo')"
             type="text"
      />
    </div>
    <div class="col-3">
      <Field v-model:value="state.att.ref"
             :label="$t('referenza')"
             type="text"
             />
    </div>
  </div>


   <div class="row  ">
    <div class="col-4 ">
      <div>
        <Field v-model:value="state.att.latitudine"
               :error="fieldsStatus.latitudine.error"
               :status="fieldsStatus.latitudine.status"
               :label="$t('latitudine')"
               label-style="width:120px"
               :placeholder="$t('es4512345')"
               type="number"
               @update:validator="validateLatitudine()"/>

      </div>
      <div class="mt-2">
        <Field v-model:value="state.att.longitudine"
               :error="fieldsStatus.longitudine.error"
               :status="fieldsStatus.longitudine.status"
               :label="$t('longitudine')"
               label-style="width:120px"
               :placeholder="$t('es1012345')"
               type="number"
               @update:validator="validateLongitudine()"/>
      </div>
      <!--      <div class="mt-2">
              <Field v-model:value="state.att.locatore"
                     :error="fieldsStatus.locatore.error"
                     :status="fieldsStatus.locatore.status"
                     label="WWL"
                     label-style="width:120px"
                     type="text"
                     @update:validator="validatelocatore(true)"/>
            </div>-->


      <div class="input-group mt-2">
        <!--suppress AllyHtmlVueInspection -->
        <span class="input-group-text" style="width:120px">WWL</span>
        <input
            v-model="state.att.locatore"
            :class="'form-control ' +  (fieldsStatus.locatore.status==='INVALID' ? 'is-invalid' : '') +  (fieldsStatus.locatore.status==='VALID' ? 'is-valid' : '')"
            :title="fieldsStatus.locatore.error"
            type="text"
            @change="validatelocatore(true)"
        />
        <div class="input-group-text btn btn-primary" @click="validatelocatore(true)">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
      </div>


      <div class="mt-2">
        <Field v-model:value="state.att.altezza"
               :label="$t('altitudine')"
               label-style="width:120px"
               type="number"
        />
      </div>
      <div class="mt-2">
        <label>{{ $t('clickSullaMappaPerSelezionareIlPuntoEsatto') }}</label>
      </div>
    </div>
    <div class="col ">
      <!--
            <MapBox ref="mapPos" :gps="false" :mapWithReferences="false" :referenceMap="true" size="width: 100%;height: 500px;"
                    :autoInit="false" uid="mapPosition"
                    @map:click="setPositionFromMap"></MapBox>
      -->

      <LeafletMap ref="mapPos" :is-embedded="true" class="mt-3" size="width: 100%;height: 500px;" @map:click="setPositionFromMap"></LeafletMap>

    </div>
  </div>


</template>

<style scoped>

</style>