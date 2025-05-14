<script lang="ts" setup>

import ActivityPanel from "./ActivityPanel.vue";
import {useStore} from "../../store/Store.ts";

const store = useStore();

store.printMode = true;

defineProps({
  uid: String,
});

</script>

<template>
  <ActivityPanel :is-print="true" :uid="uid"></ActivityPanel>
</template>

<style scoped>

</style>