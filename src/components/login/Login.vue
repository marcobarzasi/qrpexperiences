<script lang="ts" setup>
import {reactive} from "vue";
import Swal from "sweetalert2";
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import Field from "../Field.vue";
import {checkEmail, checkRequiredField} from "../utils.ts";
import {i18n} from "../translations.ts";

defineProps({
  msg: Number,
})

const state = reactive({

  user: "",
  nome: "",
  cognome: "",
  password: "",
  checkPassword: "",
  code: "",
  email: "",
  checkEmail: "",

  user_password: "",

  step: 1,
});

const fieldStatus = reactive({
  user_password: {
    error: "",
    status: "NONE",
  },
  call: {
    error: "",
    status: "NONE",
  },
  nome: {
    error: "",
    status: "NONE",
  },
  cognome: {
    error: "",
    status: "NONE",
  },
  password: {
    error: "",
    status: "NONE",
  },
  checkPassword: {
    error: "",
    status: "NONE",
  },
  email: {
    error: "",
    status: "NONE",
  },
  checkEmail: {
    error: "",
    status: "NONE",
  },

})

const sendEmail = () => {
  let validate = true;
  validate = validateCall() && validate;
  validate = validateNome() && validate;
  validate = validateCognome() && validate;
  validate = validatePassword() && validate;
  validate = validateEmail() && validate;


  if (!validate) {
    return;
  }

  if (state.password !== state.checkPassword) {
    messages.showError(i18n.global.t("Le password non coincidono"));
    return;
  }


  if (state.email !== state.checkEmail) {
    messages.showError(i18n.global.t("Le eMail non coincidono"));
    return;
  }


  state.step = 2;
  var data = {
    user: state.user,
    nome: state.nome,
    cognome: state.cognome,
    password: state.password,
    email: state.email,
  };

  server.load('login.validation',
      data,
      function (data: any) {
        if (data.success) {
          state.step = 3;
        } else {
          state.step = 1;
          $('#registration').modal('hide');

          Swal.fire({
            icon: 'error',
            title: 'Errore',
            html: i18n.global.t("ErroreInvioEmail"),
          })
        }
      }, function () {
        state.step = 1;
        // $('#registration').modal('hide');
      }
  )


}

const password = () => {
  let validate = true;
  validate = validateUserPassword() && validate;
  if (!validate) {
    return;
  }

  $('#password').modal('hide');

  var data = {
    call: state.user_password
  }
  server.load('user.resetPassword',
      data,
      function (data: any) {
        if (data.success) {
          messages.showMessage('success', i18n.global.t("Ti è stata inviata una eMail con il link per il reset della password"));
        } else {
          messages.showError(data.error);
        }
      }
  )

}

const validateCall = () => {
  return checkRequiredField(state.user, fieldStatus.call);
}

const validateNome = () => {
  return checkRequiredField(state.nome, fieldStatus.nome);
}

const validateCognome = () => {
  return checkRequiredField(state.cognome, fieldStatus.cognome);
}

const validatePassword = () => {
  return checkRequiredField(state.password, fieldStatus.password);
}

const validateCheckPassword = () => {
  return checkRequiredField(state.checkPassword, fieldStatus.checkPassword);
}

const validateUserPassword = () => {
  return checkRequiredField(state.user_password, fieldStatus.user_password);
}

const validateEmail = () => {
  if (!checkRequiredField(state.email, fieldStatus.email)) {
    return false;
  } else {
    if (!checkEmail(state.email)) {
      fieldStatus.email.error = i18n.global.t("eMail non valida");
      fieldStatus.email.status = "INVALID";
      return false;
    } else {
      fieldStatus.email.error = "";
      fieldStatus.email.status = "VALID";
      return true;
    }
  }
}

const validateCheckEmail = () => {
  return checkRequiredField(state.checkEmail, fieldStatus.checkEmail);
}


/*
1 = Codice di validazione non valido
2 = Validazione eMail riuscita, ora puoi accedere con le tue credenziali
3 = account da validare
4 = credenziali non corrette
5 = le credenziali sono state resettate.
 */

</script>

<template>

  <div class="container text-center">
    <h1 class="h3 mb-3 fw-normal">Portable Radio Experiences</h1>

    <div v-if="msg==1" class="alert alert-danger"><b>Validazione non riuscita.</b><br>
      <br>Contatta l'assistenza.
    </div>

    <div v-if="msg==2" class="alert alert-success"><b>Validazione riuscita.</b><br>
      <br>Ora puoi accedere con le tue credenziali.
    </div>

    <div v-if="msg==3" class="alert alert-warning"><b>Account in attesa di validazione.</b><br>
      <br>Nella tua casella eMail è arrivato un messaggio con il link per la validazione, controlla anche nello SPAM.
      <br> In caso di problemi contatta l'assistenza.
    </div>

    <div v-if="msg==4" class="alert alert-danger"><b>Credenziali non corrette.</b><br>
      <br>In caso di problemi contatta l'assistenza.
    </div>

    <div v-if="msg==5" class="alert alert-success"><b>La password è stata modificata. Ora puoi accedere con le tue nuove credenziali.</b><br>
      <br>In caso di problemi contatta l'assistenza.
    </div>
  </div>

  <main class="form-signin w-100 m-auto text-center">
    <form action="/server/api/login/auth.php" method="post">

      <!--suppress AllyHtmlVueInspection -->


      <div class="form-floating text-black">
        <input id="floatingInput" :placeholder="$t('callOppureEmail')" class="form-control" name="user" type="text">
        <label for="floatingInput">{{ $t('utente') }}</label>
      </div>

      <div class="form-floating text-black">
        <input id="floatingPassword" :placeholder="$t('password')" class="form-control" name="password" type="password">
        <label for="floatingPassword">{{ $t('password') }}</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">{{ $t('login') }}</button>
    </form>

    <div class="mt-3 mb-5">
      {{ $t('passwordDimenticata') }}<br>
      <a class="link-primary " data-bs-target="#password" data-bs-toggle="modal" href="#">
        {{ $t('recuperaLaPassword') }}
      </a>
    </div>

    <div>
      {{ $t('nonSeiAncoraRegistratoAlSito') }}<br>
      <a class="link-primary " data-bs-target="#registration" data-bs-toggle="modal" href="#">
        {{ $t('registratiQuiPerInviareLeTueAttivit') }}
      </a>
    </div>


    <a class="btn btn-outline-info mt-3 m-2 p-2 " href="https://www.radioexperiences.net/ticket/index.php?a=add&category=3" target="_blank"
       type="button"><i class="fa-solid fa-headset"></i>
      {{ $t('contattaLassistenza') }}
    </a>

  </main>


  <div id="app">
    <div id="password" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('recuperoPassword') }}</h5>
            <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
          </div>
          <div class="modal-body">
            <p>
              {{ $t('tiVerrInviataUnaEmailConUnLinkPerResettareLaPasswo') }}
            </p>
            <p>
              {{ $t('inCasoDiUlterioriProblemiContattaLassistenza') }}
            </p>

            <!--suppress AllyHtmlVueInspection -->
            <Field v-model:value="state.user_password" :error="fieldStatus.user_password.error"
                   :status="fieldStatus.user_password.status" class="mb-3"
                   label="Call"
                   type="text"
                   @update:validator="validateUserPassword()"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" @click="password()">{{ $t('resetPassword') }}</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">{{ $t('annulla') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div id="registration" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('registrazioneAlSito') }}</h5>
            <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
          </div>
          <div class="modal-body">
            <div v-if="state.step==1">
              <!--suppress AllyHtmlVueInspection -->
              <Field v-model:value="state.user" :error="fieldStatus.call.error" :status="fieldStatus.call.status"
                     class="mb-3" label="Call"
                     label-style="width:10rem;"
                     type="text"
                     @update:validator="validateCall()"
              />


              <Field v-model:value="state.nome" :error="fieldStatus.nome.error" :label="$t('nome')"
                     :status="fieldStatus.nome.status" class="mb-3"
                     label-style="width:10rem;"
                     type="text"
                     @update:validator="validateNome()"
              />
              <Field v-model:value="state.cognome" :error="fieldStatus.cognome.error" :label="$t('cognome')"
                     :status="fieldStatus.cognome.status" class="mb-3"
                     label-style="width:10rem;"
                     type="text"
                     @update:validator="validateCognome()"
              />

              <Field v-model:value="state.email" :error="fieldStatus.email.error" :status="fieldStatus.email.status"
                     class="mb-3" label="eMail"
                     label-style="width:10rem;"
                     type="email"
                     @update:validator="validateEmail()"/>

              <Field v-model:value="state.checkEmail" :error="fieldStatus.checkEmail.error" :status="fieldStatus.checkEmail.status"
                     :label="$t('confermaEmail')" class="mb-3"
                     label-style="width:10rem;"
                     type="email"
                     @update:validator="validateCheckEmail()"/>
              <hr>

              <Field v-model:value="state.password" :error="fieldStatus.password.error" :status="fieldStatus.password.status"
                     :label="$t('password')" class="mb-3"
                     label-style="width:10rem;"
                     type="password"
                     @update:validator="validatePassword()"
              />

              <Field v-model:value="state.checkPassword" :error="fieldStatus.checkPassword.error" :label="$t('confermaPassword')"
                     :status="fieldStatus.checkPassword.status" class="mb-3"
                     label-style="width:10rem;"
                     type="password"
                     @update:validator="validateCheckPassword()"/>


              <button class="btn btn-primary mt-3" type="button" @click="sendEmail()">{{ $t('prossimoPasso') }}
              </button>
            </div>

            <div v-if="state.step==2">
              {{ $t('tiStiamoInviandoUnaEmailAttendi') }}
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">{{ $t('loading') }}</span>
                </div>
              </div>
            </div>

            <div v-if="state.step==3">
              {{ $t('tiAbbiamoInviatoUnaEmailAllindirizzo') }} <b>{{ state.email }}</b>
              {{ $t('troveraiAllinternoUnLinkPerConfermareLaTuaRegistra') }}
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="state.step==3" class="btn btn-primary mt-3" data-bs-dismiss="modal" type="button">{{ $t('fine') }}
            </button>
            <button v-if="state.step!=3" class="btn btn-secondary" data-bs-dismiss="modal" type="button">{{ $t('annulla') }}
            </button>
          </div>
        </div>
      </div>
    </div>


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