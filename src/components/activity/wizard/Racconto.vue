<script lang="ts" setup>
import {BO_Activation} from "../../BO/BO_Activation.ts";
import {reactive} from "vue";
import {Alignment, BlockQuote, Bold, ClassicEditor, Essentials, Font, FontColor, FontFamily, FontSize, Heading, HorizontalLine, Indent, Italic, Link, List, Mention, Paragraph, Underline, Undo} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import './ckeditor.css';


const attivazione = defineModel<BO_Activation>('value', {required: true});
const emit = defineEmits(['check:logbook'])

const state = reactive({
  att: attivazione,
})

const validateDesc = (): boolean => {
  return true;//state.att.descrizione != "";
}


const validation = (): boolean => {
  let result = true;
  result &&= validateDesc();
  return result;
}


defineExpose({
  validation,
})
</script>

<template>

  <div class="row p-2">
    <div class="col">
      <ckeditor
          v-model="state.att.descrizione"
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
  </div>


</template>

<style scoped>

</style>