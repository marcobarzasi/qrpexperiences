<script lang="ts" setup>
import {server} from "../server.ts";
import {messages} from "../messages.ts";
import {reactive} from "vue";
import {BO_MailForm} from "../BO/BO_MailForm.ts";
import {Alignment, BlockQuote, Bold, ClassicEditor, Essentials, Font, FontColor, FontFamily, FontSize, Heading, HorizontalLine, Indent, Italic, Link, List, Mention, Paragraph, Underline, Undo} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';
import './ckeditor.css';
import {useToast} from "vue-toastification";
import Field from "../Field.vue";
import {useStore} from "../../store/Store.ts";

const globalState = useStore();
const toast = useToast();

const state = reactive({
  forms: [] as BO_MailForm[],
  currentForm: new BO_MailForm(),
  showText: false,
  loaded: false,
  email: globalState.user.email,
});


const loadList = () => {
  let data = {};
  server.load("mail.listForms", data, (response: any) => {
    if (response.success) {
      state.forms = response.result.list;
      state.loaded = true;
    } else {
      messages.showError(response.error);
    }
  })
}
loadList();

const saveForm = () => {
  let data = {
    mailForm: state.currentForm,
  };
  server.save("mail.saveForm", data, (response: any) => {
    if (response.success) {
      state.showText = false;
      loadList();
    } else {
      messages.showError(response.error);
    }
  })
}

const previewForm = () => {
  toast.info("Invio anteprima in corso");

  let data = {
    mailForm: state.currentForm,
    email: state.email,
  };
  server.save("mail.previewForm", data, (response: any) => {
    if (response.success) {
      toast.clear();
      toast.success("eMail inviata");
    } else {
      messages.showError(response.error);
    }
  })
}


</script>

<template>
  <div v-if="!state.loaded" class="mt-5 text-success d-flex flex-column h-100 align-items-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>


  <div v-if="state.loaded" class="mt-5">
    <div class="container mb-5">
      <h2>Gestione testi eMail</h2>


      <div class="row p-2">
        <div class="col-auto p-2">
          <Listbox v-model="state.currentForm" :options="state.forms" optionLabel="id"/>
        </div>
        <div class="col" style="height:450px">
          <Field v-model:value="state.currentForm.subject" class="mb-3" label="Oggetto" type="text"/>
          <ckeditor
              v-model="state.currentForm.text"
              :config="{
                licenseKey: 'GPL',
                  plugins: [ Bold, Essentials, Italic, Mention, Paragraph,  Undo, Alignment ,List, Heading,BlockQuote,Link,Indent,HorizontalLine,Underline, Font, FontFamily,  FontColor,FontSize],
                  toolbar:['heading', '|', 'bold', 'italic','underline', '|','fontFamily','fontSize','fontColor', '|','alignment',  'bulletedList', 'numberedList','outdent', 'indent', '|','link','blockQuote','horizontalLine'],
                  fontFamily: {
                    options: [
                      'default',
                      'Arial, sans-serif',
                      'Times New Roman, Times, Baskerville, serif',
                      'Montserrat,',
                      'Courier Prime',
                      'Arial, sans-serif',
                      'Roboto',
                      'PT Serif',
                      'Shadows Into Light',
                      'Akaya Kanadaka',
                      'Pirata One',
                      'Caveat',
                      'Quintessential',
                      'Amita'
                    ]
                  },
                  fontSize: {
                    options: [
                       '8px',
                      '10px',
                      '12px',
                      '14px',
                      '16px',
                      '18px',
                      '20px',
                      '24px',
                      '28px',
                      '32px',
                      '36px'
                    ]
                  }
                }"
              :editor="ClassicEditor"

          ></ckeditor>
          <div class="d-flex mt-3">
            <button class="btn btn-primary " type="button" @click="saveForm()">Salva</button>
            <button class="btn btn-outline-secondary ms-3 text-nowrap" type="button" @click="previewForm()">Invia anteprima</button>
            <Field v-model:value="state.email" class=" ms-3 " label="eMail" type="text"/>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <h3>Legenda TAG:</h3>
              <div v-if="state.currentForm.id=='RESET PASSWORD' || state.currentForm.id=='VALIDAZIONE'">
                <ul>
                  <li>
                    <b>code</b> - Call del destinatario
                  </li>
                  <li>
                    <b>hostUrl</b> - Url del sito
                  </li>
                </ul>
              </div>

              <div v-if="state.currentForm.id=='QSL'">
                <ul>
                  <li>
                    <b>call</b> - Call dell'attivaztore
                  </li>
                  <li>
                    <b>calldx</b> - Call del destinatario
                  </li>
                  <li>
                    <b>data_att</b> - Data dell'attivazione (formato dd/mm/aaaa)
                  </li>
                  <li>
                    <b>uid</b> - id attivazione
                  </li>
                </ul>
              </div>
            </div>
            <div class="col">
              <h3>Legenda Immagini:</h3>
              <ul>
                <li>
                  <b>logo_rexp</b> - Logo radio experiences
                </li>
                <li>
                  <b>banner_rexp</b> - Banner Radio experiences
                </li>
                <li>
                  <b>logo_pp</b> - Logo donazione PayPal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>


</template>

<style scoped>

</style>