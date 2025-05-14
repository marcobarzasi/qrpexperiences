<script lang="ts" setup>

import {reactive, ref} from "vue";
import {server} from "../server.ts";

import {messages} from "../messages.ts";
import {BO_User} from "../BO/BO_User.ts";
import {FilterMatchMode} from "primevue/api";
import User from "./User.vue";
import {formatDate} from "../utils.ts";
import {useToast} from 'vue-toastification'
//import Header from "../Header.vue";
const toast = useToast();

const showInfo = (message: string) => {
  toast.info(message);
};

const state = reactive({
  users: [] as BO_User[],
  user: new BO_User(),
  currentUser: new BO_User(),
  loaded: false,
})
const filters = ref({
  global: {value: null, matchMode: FilterMatchMode.CONTAINS},
});


const loadList = () => {
  let data = {};
  server.load("user.list", data, (response: any) => {
    if (response.success) {
      state.users = response.result.users;
      state.loaded = true;
    } else {
      messages.showError(response.error);
    }
  })
}
loadList();

const editUtente = (user: BO_User) => {
  state.currentUser = user;
  $('#userMod').modal('show');

}

const deleteUtente = (user: BO_User) => {
  messages.confirm("Sicuro di voler eliminare questa attivazione?", () => {
    let data = {
      call: user.call
    };
    server.load("user.delete", data, (response: any) => {
      if (response.success) {
        loadList();
      } else {
        messages.showError(response.error);
      }
    })
  })
}

const validateUtente = (user: BO_User) => {
  let data = {
    call: user.call
  };
  server.load("user.validate", data, (response: any) => {
    if (response.success) {
      showInfo('Utente validato.');
      loadList();
    } else {
      messages.showError(response.error);
    }
  })
}

const changePassword = (user: BO_User) => {
  let data = {
    call: user.call
  };
  server.load("user.resetPassword", data, (response: any) => {
    if (response.success) {
      showInfo('Email di reset password inviata.');
      loadList();
    } else {
      messages.showError(response.error);
    }
  })
}

</script>

<template>

  <div v-if="!state.loaded" class="mt-5 text-success d-flex flex-column h-100 align-items-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">{{ $t('loading') }}</span>
    </div>
  </div>
  <div v-if="state.loaded" class="mt-5">
    <div class="container">
      <DataTable v-model:filters="filters"
                 :rows="50" :rowsPerPageOptions="[20, 50,100,500]"
                 :sortOrder="-1" :value="state.users" filterDisplay="menu"
                 paginator removableSort
                 sortField="create_time" stripedRows
      >
        <template #header>
          <div class="flex justify-content-between">
            <div class="flex">
              <User v-model:value="state.currentUser" @update:saved="loadList();"></User>
            </div>

            <div class="mt-3">
              Utenti: {{ state.users.length }}
            </div>

            <IconField class="flex align-items-center" iconPosition="left">
              <InputIcon class="flex align-items-center">
                <i class="pi pi-search"/>
              </InputIcon>
              <InputText v-model="filters['global'].value" :placeholder="$t('ricercaUtenti')"/>
            </IconField>
          </div>

        </template>
        <Column :exportable="false" style="width:10rem">
          <template #body="data">
            <button class="btn btn-outline-primary me-2"
                    data-bs-target="#pazMod" data-bs-toggle="modal"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                    @click="editUtente(data.data)"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-outline-danger me-2"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                    @click="deleteUtente(data.data)"><i class="fa-solid fa-trash"></i>
            </button>
            <button v-if="!data.data.validated" class="btn btn-outline-success me-2"
                    style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                    @click="validateUtente(data.data)"><i class="fa-solid fa-user-check"></i>
            </button>
            <button v-if="data.data.validated" class="btn btn-outline-warning me-2" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                    :title="$t('resetPassword')"
                    @click="changePassword(data.data)"><i class="fa-solid fa-key"></i>
            </button>

          </template>
        </Column>

        <Column :showFilterMenu="false" field="call" header="Call" sortable>
        </Column>

        <Column :showFilterMenu="false" field="cognome" header="Cognome" sortable>
        </Column>

        <Column :showFilterMenu="false" field="nome" header="Nome" sortable>
        </Column>

        <Column :showFilterMenu="false" field="email" header="eMail" sortable>
        </Column>


        <Column :showFilterMenu="false" field="role" header="Ruolo" sortable>
        </Column>

        <Column :showFilterMenu="false" field="create_time" header="Data registrazione" sortable>
          <!--suppress AllyHtmlVueInspection -->
          <template #body="{ data }">
            {{ formatDate((data as BO_User).create_time) }}
          </template>
        </Column>

      </DataTable>
    </div>
  </div>

</template>

<style scoped>
.center-text .p-datatable-cell-data {
  justify-content: center;
}
</style>