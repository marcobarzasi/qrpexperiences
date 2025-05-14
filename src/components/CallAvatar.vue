<script lang="ts" setup>
import {server} from "./server.ts";
import {reactive, watch} from "vue";
import {BO_User} from "./BO/BO_User.ts";

const state = reactive({
  user: new BO_User(),
})

const props = defineProps({
  userCall: {
    type: String,
    required: true,
  },
})


const getImage = () => {
  if (props.userCall == "") {
    return;
  }
  server.load("user.getInfo", {userCall: props.userCall}, (response: any) => {
    if (response.success) {
      state.user = response.result.userInfo;
    }
  });
}
getImage();

// Watch for changes in the `call` prop
watch(() => props.userCall, () => {
  getImage(); // Fetch new image when `call` changes
});

</script>

<template>

  <Avatar v-if="state.user.image==''" :label="userCall.charAt(0)" class="mr-2" shape="circle" style="background-color: #ece9fc; color: #2a1261"/>
  <Avatar v-else :image="state.user.image" class="mr-2" shape="circle" style="background-color: #ece9fc; color: #2a1261"/>

</template>

<style scoped>

</style>