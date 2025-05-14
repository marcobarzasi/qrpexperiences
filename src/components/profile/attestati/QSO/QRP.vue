<script lang="ts" setup>
import {reactive, watch} from "vue";
import {formatNumber} from "../../../utils.ts";
import KnobAttestati from "../KnobAttestati.vue";
import {useStore} from "../../../../store/Store.ts";
import {KnobStatus} from "../KnobStatus.ts";

const globalState = useStore();

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  maxLevel: {
    type: Number,
    required: true
  },
  minLevel: {
    type: Number,
    required: true
  }

})

const state = reactive({
  value: props.value,
  status: KnobStatus.UNKNOW,
})


const getColorRange = () => {
  const levelPerc = Math.round(props.maxLevel / 100);
  if (state.value < levelPerc * 30) {
    return 'orange';
  } else if (state.value > levelPerc * 30 && state.value < levelPerc * 70) {
    return 'dodgerblue';
  } else if (state.value > levelPerc * 70 && state.value < levelPerc * 100) {
    return 'palegreen';
  } else {
    return 'forestgreen';
  }
}

const checkAtt = () => {
  if (state.value > props.maxLevel) {
    state.value = props.maxLevel;
  }

  if (state.value < props.minLevel) {
    state.status = KnobStatus.WAITING;
  } else if (state.value >= props.minLevel && state.value < props.maxLevel) {
    state.status = KnobStatus.SHOW;
  } else {
    state.status = KnobStatus.REACHED;
  }
}

const make = () => {
  window.open('/server/api/Api.php?service=attestati.make&id=QRP.png&level=' + props.maxLevel + '&call=' + globalState.user.call, '_blank');
}


checkAtt();

watch(() => props.value, () => {
  checkAtt();
})

</script>

<template>
  <div class="card p-2 shadow-1 text-center" style="width:11rem;height:15rem">
    <h5>{{ formatNumber(maxLevel) }}</h5>
    <div class="mb-2" style="position: absolute; bottom: 0; ">
      <KnobAttestati :max="maxLevel" :min="minLevel" :status="state.status" :value="state.value" :valueColor="getColorRange()"/>
      <button v-if="state.value<maxLevel" class="btn btn-light mt-2" disabled style="width:155px;height:40px"></button>
      <button v-if="state.value>=maxLevel" class="btn btn-primary mt-2" style="width:155px;height:40px" @click="make">{{ $t('scaricaAttestato') }}</button>
    </div>
  </div>
</template>

<style scoped>

</style>