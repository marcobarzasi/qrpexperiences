<script lang="ts" setup>
import {reactive} from "vue";
import Swal from "sweetalert2";
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {checkRequiredField} from "../utils.ts";
import {router} from "../../routes.ts";
//import Header from "../Header.vue";

const state = reactive({
  password: "",
  checkPassword: "",
  code: "",
});

const props = defineProps({
  code: String,
})

const fieldStatus = reactive({
  password: {
    error: "",
    status: "NONE",
  },
  checkPassword: {
    error: "",
    status: "NONE",
  },
})

const resetPassword = () => {
  let validate = true;
  validate = validatePassword() && validate;
  validate = validateCheckPassword() && validate;

  if (!validate) {
    messages.showError("Inserire una password nuova.");
    return;
  }


  if (state.password !== state.checkPassword) {
    messages.showError("Le password non coincidono");
    return;
  }


  var data = {
    code: props.code,
    password: state.password,
  };

  server.save('user.resetPassword2',
      data,
      function (data: any) {
        if (data.success) {
          router.push('/login/5');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Errore',
            html: "Errore nell'invio dell'eMail, riprova più tardi.",
          })
        }
      }
  )
}

const validatePassword = () => {
  return checkRequiredField(state.password, fieldStatus.password);
}

const validateCheckPassword = () => {
  return checkRequiredField(state.checkPassword, fieldStatus.checkPassword);
}

</script>

<template>
  <div class="container text-center">
    <h1 class="h3 mb-3 fw-normal">Portable Experiences</h1>
    <div> Inserisci la tua nuova password:</div>
  </div>

  <div class="form-signin w-100 m-auto text-center">
    <div class="form-floating text-black">
      <input id="floatingInput" v-model="state.password" class="form-control" placeholder="nuova password" type="password">
      <label for="floatingInput">Nuova Password</label>
    </div>

    <div class="form-floating text-black">
      <input id="floatingPassword" v-model="state.checkPassword" class="form-control" placeholder="ripeti password" type="password">
      <label for="floatingPassword">Ripeti Password</label>
    </div>

    <div class="w-100 btn btn-lg btn-primary" @click="resetPassword">Salva</div>
  </div>
</template>

<style scoped>
.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}


.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}


</style>