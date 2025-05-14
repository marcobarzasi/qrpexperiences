<script lang="ts" setup>
import {reactive} from "vue";
import {getBandGroup} from "../../utils.ts";
import {BO_qrbBand} from "../../BO/BO_qrbBand.ts";
import KnobAttestati from "./KnobAttestati.vue";

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
  if (state.value < 30000) {
    return 'orange';
  } else if (state.value > 30000 && state.value < 70000) {
    return 'dodgerblue';
  } else if (state.value > 70000 && state.value < 100000) {
    return 'palegreen';
  } else {
    return 'forestgreen';
  }
}

const checkAtt = () => {
  state.value = 0;
  props.att.forEach((item) => {
    if (getBandGroup(item.band) == "HF") {
      state.value += item.qrb;
    }
  })
  if (state.value > 100000) {
    state.value = 100000;
  }

}


defineExpose({
  checkAtt
})
</script>

<template>
  <div class="card p-2 shadow-1 text-center" style="width:10rem;height:15rem">
    <!--suppress AllyHtmlVueInspection -->
    <h5>QRB HF 100.000Km</h5>
    <div class="mb-2" style="position: absolute; bottom: 0; ">
      <KnobAttestati :max="100000" :min="0" :status="status" :value="state.value" :valueColor="getColorRange()"/>
      <div v-if="state.value<100000" style="width:140px;height:40px"></div>
      <button v-if="state.value>=100000" class="btn btn-primary mt-2" style="width:140px;height:40px" @click="state.value=100000">{{ $t('ottieniAttestato') }}</button>
    </div>
  </div>
</template>

<style scoped>

</style>