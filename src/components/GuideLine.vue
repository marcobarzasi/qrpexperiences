<script lang="ts" setup>

import {reactive} from "vue";
import {server} from "./server.ts";
import {useToast} from "vue-toastification";
import './ckeditor.css';
import {useStore} from "../store/Store.ts";
import {i18n} from "./translations.ts";
import {Alignment, BlockQuote, Bold, ClassicEditor, Essentials, Font, FontColor, FontFamily, FontSize, Heading, HorizontalLine, Indent, Italic, Link, List, Mention, Paragraph, Underline, Undo} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';


const globalState = useStore();
const toast = useToast();
const browserLanguage = i18n.global.locale;
const mode = import.meta.env.MODE;
const state = reactive({
  modify: false,
  testo: '',
})

const load = () => {
  server.load("text.get", {
    language: browserLanguage,
    topic: 'guideline'
  }, (response: any) => {
    if (response.success) {
      state.testo = response.result.text;
    }
  })
}
load();

const save = () => {
  server.save("text.save", {
    language: browserLanguage,
    topic: 'guideline',
    text: state.testo
  }, (response: any) => {
    if (response.success) {
      toast.success("Salvato");
    }
  });
}

</script>

<template>
  <div class="container">

    <div v-if="mode!='prod' && !state.modify && globalState.user.role=='MANAGER'" class="btn btn-outline-secondary btn-sm m-3" @click="state.modify=true"><i class="fa-solid fa-pen"></i> {{ $t('modifica') }}</div>

    <div v-if="state.modify" class="mt-3 mb-3">
      <ckeditor
          v-model="state.testo"
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
      <div class="btn btn-primary mt-3" @click="save">{{ $t('salva') }}</div>
      <hr>
    </div>

    <div v-html="state.testo">
    </div>

  </div>
</template>

<style scoped>

</style>