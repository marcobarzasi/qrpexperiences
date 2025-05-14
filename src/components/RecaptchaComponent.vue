<template>

</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useChallengeV3} from 'vue-recaptcha'
import {useStore} from "../store/Store.ts";

const {execute} = useChallengeV3('submit')
const globalState = useStore();
const isRecaptchaReady = ref(false);
declare const grecaptcha: any;

async function request() {
  const response = await execute()
  //console.log(response);
  return response;
}

onMounted(() => {
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.ready(() => {
      isRecaptchaReady.value = true;
      globalState.request = request;
      // console.log('reCAPTCHA OK');
    });
  } else {
    console.error('reCAPTCHA not found');
  }
});

defineExpose({
  request,
})


</script>