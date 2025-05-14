<!--suppress AllyHtmlVueInspection, AllyHtmlVueInspection -->
<script lang="ts" setup>
import {BO_qso} from "../../BO/BO_qso.ts";
import Field from "../../Field.vue";
import List from "../../List.vue";
import {useSharedLogicQSO} from "./QSO.ts";

const emit = defineEmits(['update:new', 'update:close'])
const qso = defineModel<BO_qso>('qso', {required: true});


defineProps({
  isNewQSO: {Boolean, default: false},
})


const externalEmitters = {
  emit,
}

const externalModels = {
  qso,
}

const {
  state,
  bands,
  modes,
  fieldsStatus,
  addQSO,
  closeQSO,
  validateData,
  validateTime,
  validateCall,
  validateBand,
  validateMode,
  validateWWL,

} = useSharedLogicQSO(externalEmitters, externalModels);


</script>


<template>


  <div id="dettaglio_qso" class="modal fade" data-bs-backdrop="static" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('dettaglioQso') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">

          <div class="container">
            <div class="row  p-2">
              <div class="col">
                <Field v-model:value="qso.data"
                       :error="fieldsStatus.data.error"
                       :status="fieldsStatus.data.status"
                       :label="$t('data')"
                       type="date"
                       @update:validator="validateData()"/>

              </div>
              <div class="col">
                <Field v-model:value="qso.time"
                       :error="fieldsStatus.time.error"
                       :status="fieldsStatus.time.status"
                       :label="$t('time')"
                       type="time"
                       @update:validator="validateTime()"/>
              </div>
            </div>

            <div class="row  p-2">
              <div class="col">
                <!--suppress AllyHtmlVueInspection -->
                <Field v-model:value="qso.call"
                       :error="fieldsStatus.call.error"
                       :status="fieldsStatus.call.status"
                       label="Call"
                       type="text"
                       @update:validator="validateCall()"/>
              </div>
              <div class="col">
                <List v-model:value="qso.banda_m"
                      :data-list="bands"
                      :error="fieldsStatus.banda_m.error"
                      :status="fieldsStatus.banda_m.status"
                      :label="$t('banda')"
                      @update:validator="validateBand()"
                />
              </div>
              <div class="col">
                <List v-model:value="qso.modo"
                      :data-list="modes"
                      :error="fieldsStatus.modo.error"
                      :status="fieldsStatus.modo.status"
                      :label="$t('modo')"
                      @update:validator="validateMode()"
                />
              </div>
            </div>

            <div class="row  p-2">
              <div class="col sm">
                <Field v-model:value="qso.rst_send"
                       :label="$t('rstInviato')"
                       type="text"
                />

              </div>
              <div class="col sm">
                <Field v-model:value="qso.rst_rcvd"
                       :label="$t('rstRicevuto')"
                       type="text"
                />
              </div>
            </div>

            <div class="row  p-2">
              <div class="col sm">
                <!--suppress AllyHtmlVueInspection -->
                <Field v-model:value="qso.wwl"
                       :error="fieldsStatus.wwl.error"
                       :status="fieldsStatus.wwl.status"
                       label="WWL"
                       type="text"
                       @update:validator="validateWWL()"/>
                <div v-if="state.searchWWL" class="text-primary">{{ $t('ricercaWwlInCorso') }}</div>

              </div>
              <div class="col sm">
                <Field v-model:value="qso.power"
                       :label="$t('potenza')"
                       postLabel="W"
                       type="number"
                />

              </div>
              <div class="col sm ">
                <Field v-model:value="qso.ref"
                       :error="fieldsStatus.ref.error"
                       :status="fieldsStatus.ref.status"
                       :label="$t('ref')"
                       type="text"
                       />
              </div>
            </div>
          </div>

        </div>
        <div class="modal-footer ">
          <Message v-if="state.message!=''" :key="state.messageId" :life="5000" :sticky="false" class="m-0 p-0" severity="success">
            <template #container>
              <label class="p-1"><i class="fa-solid fa-check"></i> {{ state.message }}</label>
            </template>
          </Message>
          <!--          <div v-if="!isNewQSO">Le modifiche vengono salvate automaticamente.</div>-->
          <button class="btn btn-primary" data-bs-dismiss="modal" type="button" @click="closeQSO()">{{ $t('ok') }}
          </button>
          <button v-if="isNewQSO" class="btn btn-primary" type="button" @click="addQSO()">{{ $t('aggiungiQso') }}</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>