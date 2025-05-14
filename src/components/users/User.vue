<!--suppress ALL -->
<script lang="ts" setup>

import {server} from '../server.js'
import {ModelRef, reactive, ref, watch} from "vue";
import {messages} from "../messages.js";
import {BO_User} from "../BO/BO_User.ts";
import Field from "../Field.vue";
import List from "../List.vue";


const value: ModelRef<BO_User> = defineModel('value', {required: true})
const emit = defineEmits(['update:saved'])

const state = reactive({
  currentUser: value, //value.value as BO_Volontario,
  password: "",
  password2: "",
  modify: false,
})

const fieldsStatus = reactive({
  call: {
    error: "",
    status: "NONE"
  },
});

const roles = ref([{label: "Manager", value: "MANAGER"}, {label: "Utente", value: "USER"}]);

function saveUser() {
  let result = true;
  result &&= validateCall();

  if (!result) {
    messages.showMessage('warning', "Ci sono dei campi mancanti o non corretti.");
    return
  }


  var data = {
    user: state.currentUser,
    password: state.password,
  };
  server.save('user.save',
      data,
      function () {
        $('#userMod').modal('hide');
        emit('update:saved');
      });
}

function resetForm() {

  $('#userMod').modal('show');
  state.currentUser = new BO_User();
}


const validateCall = () => {
  const codfis = state.currentUser.call;
  if (codfis === undefined || codfis === "") {
    fieldsStatus.call.status = "INVALID";
    fieldsStatus.call.error = "Campo obbligatorio.";
    return false;
  } else {
    fieldsStatus.call.status = "VALID";
    fieldsStatus.call.error = "";
    return true;
  }
}


watch(state, () => {
  console.log(state);

});

</script>

<template>
  <button class="btn btn-primary mb-3" type="button"
          @click="resetForm()"><i class="fa-solid fa-user-plus"></i> {{ $t('aggiungiUtente') }}
  </button>


  <div id="userMod" class="modal fade modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">


      <div class="modal-content">
        <div class="modal-header bg-primary">
          <h5 class="modal-title">{{ $t('utente') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body m-3">
          <div class="row mb-1">
            <div class="col">
              <Field v-model:value="state.currentUser.nome" :label="$t('nome')" labelStyle="width:5rem" type="text"/>
            </div>
            <div class="col">
              <Field v-model:value="state.currentUser.cognome" :label="$t('cognome')" labelStyle="width:6rem" type="text"/>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col">
              <Field v-model:value="state.currentUser.call" :error="fieldsStatus.call.error" :readOnly="state.modify"
                     :status="fieldsStatus.call.status"
                     label="Call"
                     labelStyle="width:5rem"
                     type="text"
                     @update:validator="validateCall()"/>
            </div>
            <div class="col">
              <Field v-model:value="state.currentUser.email" label="eMail" labelStyle="width:6rem"
                     type="email"/>
            </div>
          </div>
          <div class="row mb-1">
            <div class="col">
              <List v-model:value="state.currentUser.role" :data-list="roles" :label="$t('ruolo')" labelStyle="width:6rem"/>
            </div>
          </div>
          <hr>
          <div class="row mb-1">
            <div class="col-6">
              <Field v-model:value="state.password" :label="$t('password')" labelStyle="width:9rem" type="password"/>
            </div>

          </div>
          <div class="row mb-1">
            <div class="col-6">
              <Field v-model:value="state.password2" :label="$t('ripetiPassword')" labelStyle="width:9rem" type="password"/>
            </div>
            <div class="col-auto flex">
              <InputSwitch v-model="state.currentUser.changePassword" class="mt-3"/>
              <label class="mt-3 ms-3">{{ $t('cambiaPasswordAlProssimoLogin') }}</label>
            </div>
          </div>
        </div>


        <div class="modal-footer">
          <button class="btn btn-secondary me-3" data-bs-dismiss="modal" type="button">{{ $t('chiudi') }}</button>
          <button class="btn btn-primary" type="button" @click="saveUser();">{{ $t('salva') }}</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
