<script setup lang="ts">
import Header from "./components/Header.vue";
import Cookies from "./components/Cookies.vue";

import {useStore} from "./store/Store.ts";

const store = useStore();


</script>

<template>
  <Header></Header>
  <RouterView></RouterView>
  <Cookies v-if="!store.printMode"></Cookies>
</template>

<style scoped>

</style>
