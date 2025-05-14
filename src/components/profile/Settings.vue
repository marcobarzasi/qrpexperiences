<!--suppress ALL -->
<script lang="ts" setup>

import './settings.css';
import QSL from "../QSL.vue";
import {useSharedLogicSettings} from "./Settings.ts";
import {Alignment, BlockQuote, Bold, ClassicEditor, Essentials, Font, FontColor, FontFamily, FontSize, Heading, HorizontalLine, Indent, Italic, Link, List, Mention, Paragraph, Underline, Undo} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './ckeditor.css';

const {
  state,
  langs,
  save,
} = useSharedLogicSettings();

</script>

<template>

  <div class="container mt-3">
    <h2>{{ $t('impostazioni') }}</h2>
    <div class="row ">
      <div class="col-auto text-center mb-5">
        <div id="image-container">
          <img :src="state.user.image" class="img-thumbnail" style="width: 260px;heigth:260px">
        </div>
        <div style="font-size: 12px">{{ $t('immagineOttenutaDa') }} <!--suppress AllyHtmlVueInspection -->
          <a href="https://it.gravatar.com/" target="_blank">Gravatar</a></div>

        <div class="fw-bold fs-1">{{ state.user.call }}</div>
        {{ state.user.nome }} {{ state.user.cognome }}<br>
      </div>
      <div class="col">
        <div class="input-group pb-3">
          <span class="input-group-text" style="width:150px">{{ $t('nome') }}</span>
          <input id="nome" v-model="state.user.nome" class="form-control" type="text"/>
        </div>
        <div class="input-group pb-3">
          <span class="input-group-text" style="width:150px">{{ $t('cognome') }}</span>
          <input id="cognome" v-model="state.user.cognome" class="form-control" type="text"/>
        </div>
        <div class="input-group pb-3">
          <span class="input-group-text" style="width:150px">eMail</span>
          <input id="email" v-model="state.user.email" class="form-control" type="email"/>
        </div>
        <SelectButton v-model="state.user.language" :options="langs" class="pb-3" optionLabel="label" optionValue="value" @click="$i18n.locale=state.user.language">
          <template #option="slotProps">
            <flag :iso="slotProps.option.flag"/>
          </template>
        </SelectButton>

        <div v-if="state.user.changePassword" class="alert alert-warning">{{ $t('eStatoRichiestoDiCambiareLaPassword') }}</div>
        <div class="input-group pb-3">
          <span class="input-group-text" style="width:150px">{{ $t('cambiaPassword') }}</span>
          <input id="password" v-model="state.password" class="form-control" type="password"/>
          <span class="input-group-text" style="width:150px">{{ $t('ripetiPassword') }}</span>
          <input id="password2" v-model="state.password2" class="form-control" type="password"/>
        </div>
        <hr>
        <h4>{{ $t('presentazione') }}</h4>
        <div class="">
          <ckeditor
              v-model="state.user.bio"
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
        </div>
        <hr>
        <div class="row">
          <div class="col-auto">
            <button class="btn btn-primary m-2 " type="button" @click="save()">{{ $t('salva') }}</button>
          </div>
        </div>
        <div class="row  pt-4">
          <label class="h3">QSL</label>
        </div>

        <QSL
            :call="state.user.call"
            :enable-custom="true"
            :is-activation="true"
            :path="'profile_QSL/'+state.user.call"
            commento="Tnx for QSO."
            uid=""
        ></QSL>
      </div>
    </div>

  </div>


</template>

<style scoped>

</style>