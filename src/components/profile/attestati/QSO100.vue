<script lang="ts" setup>
import {reactive} from "vue";
import {BO_qrbBand} from "../../BO/BO_qrbBand.ts";
import KnobAttestati from "./KnobAttestati.vue";
import {useStore} from "../../../store/Store.ts";

const globalState = useStore();

const props = defineProps({
  att: {
    type: Array as () => BO_qrbBand[],
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

const state = reactive({
  value: 0,

})

const getColorRange = () => {
  if (state.value < 30) {
    return 'orange';
  } else if (state.value > 30 && state.value < 70) {
    return 'dodgerblue';
  } else if (state.value > 70 && state.value < 100) {
    return 'palegreen';
  } else {
    return 'forestgreen';
  }
}

const checkAtt = () => {
  state.value = 0;
  props.att.forEach((item) => {
    state.value += item.qso;
  })
  if (state.value > 100) {
    state.value = 100;
  }

}

const make = () => {
  window.open('/server/api/Api.php?service=attestati.make&id=QSO100&call=' + globalState.user.call, '_blank');
}

defineExpose({
  checkAtt
})
</script>

<template>
  <div class="card p-2 shadow-1 text-center" style="width:10rem;height:15rem">
    <!--suppress AllyHtmlVueInspection -->
    <h5>100 QSO</h5>
    <div class="mb-2" style="position: absolute; bottom: 0; ">
      <KnobAttestati :max="100" :min="0" :status="status" :value="state.value" :valueColor="getColorRange()"/>
      <button v-if="state.value<100" class="btn btn-dark mt-2" disabled style="width:140px;height:40px"></button>
      <button v-if="state.value>=100" class="btn btn-primary mt-2" style="width:142px;height:40px" @click="make">{{ $t('scaricaAttestato') }}</button>
    </div>
  </div>
</template>

<style scoped>

</style>