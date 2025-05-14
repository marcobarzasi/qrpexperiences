<!--suppress ALL -->
<script lang="ts" setup>

import {reactive, ref} from "vue";
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart, HeatmapChart, LineChart, PieChart} from 'echarts/charts';
import {CalendarComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent,} from 'echarts/components';
import VChart from 'vue-echarts';
import {BO_Bar} from "../BO/BO_Bar.ts";
import {BO_Pie} from "../BO/BO_Pie.ts";
import {BO_Calendar} from "../BO/BO_Calendar.ts";
import {BO_bestDX} from "../BO/BO_bestDX.ts";


const nfObject = new Intl.NumberFormat('it-IT')


const anni = ref(new BO_Bar());
const bande = ref(new BO_Pie());
const modi = ref(new BO_Pie());
const periodi = ref(new BO_Calendar());

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);


const state = reactive({
  totaleReferenze: 1,
  parchiAttivati: 0,
  attivatori: 0,
  cacciatori: 0,
  park2park: 0,
  attivazioni: 0,
  shared: 0,
  qso: 0,
  bestDX: [] as BO_bestDX[],

  loaded: false,
  loadedParchi: false,
})

const load = () => {
  server.load("stat.generic", {id: 'attivazioni'}, (response: any) => {
    if (response.success) {
      state.attivazioni = response.result.attivazioni;
      state.shared = response.result.shared;
    } else {
      messages.showError(response.error);
    }
    state.loadedParchi = true;
  });

  server.load("stat.generic", {id: 'totali'}, (response: any) => {
    if (response.success) {
      state.cacciatori = response.result.cacciatori;
      state.qso = response.result.qso;
      state.bestDX = response.result.bestDX;
    } else {
      messages.showError(response.error);
    }
    state.loaded = true;
  })
  server.load("stat.generic", {id: 'bande'}, (response: any) => {
    if (response.success) {

      bande.value.descriptor.series[0].data = reduce(response.result.bande, 2.5);
    } else {
      messages.showError(response.error);
    }
    state.loaded = true;
  })


  server.load("stat.generic", {id: 'anni'}, (response: any) => {
    if (response.success) {

      anni.value.descriptor.series[0].data = response.result.anni.map((o: any) => {
        return o.value
      });
      anni.value.descriptor.xAxis.data = response.result.anni.map((o: any) => {
        return o.name
      });

    } else {
      messages.showError(response.error);
    }
    state.loaded = true;
  })


  server.load("stat.generic", {id: 'modi'}, (response: any) => {
    if (response.success) {
      modi.value.descriptor.series[0].data = reduce(response.result.modi, 2);
    } else {
      messages.showError(response.error);
    }
    state.loaded = true;
  })

  server.load("stat.generic", {id: 'periodi'}, (response: any) => {
    if (response.success) {
      periodi.value.descriptor.series[0].data = response.result.periodi_1;
      periodi.value.descriptor.series[1].data = response.result.periodi_0;
    } else {
      messages.showError(response.error);
    }
    state.loaded = true;
  })

}

load();


const formatNumber = (number: number) => {
  return nfObject.format(number);
}


const reduce = (dataset: any, thresholdPercent: number) => {

  let valueSum = 0;
  const values = dataset.map((v: any) => {
    valueSum += Number(v.value);
    return {name: v.name, value: Number(v.value)};
  });


  //const valueSum = values.reduce((a:any, b:any) => a.value + b.value, {value:0});

  let slicer = values.reduce((accumulator: any, currObj: any) => {
    const percent = 100 * currObj.value / valueSum;
    if (percent < thresholdPercent) {
      const others = accumulator.find((o: any) => o.name == 'Altri');
      if (!others) {
        return accumulator.concat({name: 'Altri', value: currObj.value});
      }
      others.value += currObj.value;
    } else {
      accumulator.push(currObj);
    }
    return accumulator;
  }, []);


  slicer = slicer.sort((a: any, b: any) => {
    if (a.name == 'Altri') {
      return 1;
    }
    if (b.name == 'Altri') {
      return -1;
    }

    if (a.value > b.value)
      return -1;
    if (a.value < b.value)
      return 1;

    return 0;
  });

  return slicer;


}


</script>

<template>
  <div class="container mt-3">

    <div class="row">
      <div class="col">

        <Card class="mt-3 shadow">
          <template #title>{{ $t('totali') }}</template>
          <template #content>
            <div class="row">
              <div class="col border-left-1">
                <h5>{{ $t('attivit') }}</h5>
                <h1>{{ formatNumber(state.attivazioni) }}</h1>
                <small>{{ $t('diCuiStatesharedCondivisePubblicamente', {shared: state.shared}) }}</small>
              </div>
              <div class="col border-left-1">
                <h5>{{ $t('callCollegati') }}</h5>
                <h1>{{ formatNumber(state.cacciatori) }}</h1>
              </div>
              <div class="col border-left-1">
                <h5>QSO</h5>
                <h1>{{ formatNumber(state.qso) }}</h1>
              </div>
              <div class="col-3 border-left-1">
                <h5>{{ $t('bestDx') }}</h5>
                <Carousel :autoplayInterval="3000" :circular="true" :numScroll="1" :numVisible="1" :showIndicators="false" :value="state.bestDX">
                  <template #item="slotProps">
                    <h1>{{ formatNumber(slotProps.data.km) }} Km</h1>
                    <div>{{ $t('con') }} <b><a :href="'/activity/'+slotProps.data.uid" target="_blank">{{ slotProps.data.call }}</a></b> <small class="text-secondary">@ {{ slotProps.data.banda_m }} {{ slotProps.data.modo }}</small></div>
                  </template>
                </Carousel>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div class="row">
      <div class="col p-2">
        <Card class="shadow">
          <template #title>{{ $t('attivit') }}</template>
          <template #content>
            <v-chart :option="anni.descriptor" autoresize class="chart"/>
          </template>
        </Card>
      </div>
      <div class="col p-2">
        <Card class="shadow">
          <template #title>{{ $t('bandePreferite') }}</template>
          <template #content>
            <v-chart :option="bande.descriptor" autoresize class="chart"/>
          </template>
        </Card>
      </div>
      <div class="col p-2">
        <Card class="shadow">
          <template #title>{{ $t('modiDiTrasmissione') }}</template>
          <template #content>
            <v-chart :option="modi.descriptor" autoresize class="chart"/>
          </template>
        </Card>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <Card class="shadow">
          <template #title>{{ $t('periodiDiAttivit') }}</template>
          <template #content>
            <v-chart :option="periodi.descriptor" autoresize class="chart"/>
          </template>
        </Card>
      </div>
    </div>
  </div>


</template>

<style scoped>
.chart {
  height: 40vh;
}
</style>