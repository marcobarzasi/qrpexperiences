<script lang="ts" setup>

import {BO_Activation} from "../../BO/BO_Activation.ts";
import moment from "moment";
import {bytesToSize, extractVideoID} from "../../utils.ts";
import Field from "../../Field.vue";
import {useSharedLogicFoto} from "./Foto.ts";


const attivazione = defineModel<BO_Activation>('value', {required: true});
const emit = defineEmits(['check:logbook'])

const externalModels = {
  attivazione,
}

const {
  state,
  validation,
  reloadImages,
  deleteImage,
  onUpload,
  fieldsStatus,
  getImagesSize,
  validateVideo,
} = useSharedLogicFoto(externalModels);

defineExpose({
  validation,
  reloadImages,
})
</script>

<template>

  <div class="row">
    <div class="col card shadow-1 p-3">
      <h3>{{ $t('foto') }}</h3>
      <div v-if="state.att.data==''" class="alert alert-warning" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i> {{ $t('perCaricareLeImmaginiNecessarioInserireLaDataDella') }}
      </div>

      <FileUpload :auto="true"
                  :disabled="state.att.data=='' || (50000000 - getImagesSize())<=0 "
                  :maxFileSize="50000000" :multiple="true" :url="'/server/api/UploaderImages.php?uid='+state.att.uid+'&year='+moment(state.att.data).year()" accept="image/*" name="files[]" @upload="onUpload">
        <template #header="{ chooseCallback }">
          <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
            <div class="flex gap-2 align-items-center">
              <button :class="'btn btn-primary' + (state.att.data=='' || (50000000 - getImagesSize())<=0 ? ' disabled ' : '') " @click="chooseCallback()">{{ $t('scegliLeImmagini') }}</button>
              {{ $t('spazioUtilizzato') }} <span :class="((50000000 - getImagesSize())<=0 ? 'fw-bold text-danger' : '') ">{{ bytesToSize(getImagesSize()) }}</span> (max: 50Mb)
            </div>
          </div>
        </template>
        <template #empty>
          <p>{{ $t('trascinaQuiLeImmaginiDaCaricare') }}</p>
        </template>
      </FileUpload>
      <hr>
      <div v-if="state.images" class="grid mt-5">
        <div v-for="(image, index) of state.images" :key="index" class="col-3 text-center card m-1">
          <img :alt="image.name" :src="image.name" style="cursor: pointer;max-height:120px;"/>
          <div class="mt-2">
            <div>{{ bytesToSize(image.size) }}</div>
            <button class="btn btn-danger" @click="deleteImage(image)">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col card shadow-1 ms-3 p-3">
      <h3>{{ $t('video') }}</h3>
      <div class="form-group">

        <Field v-model:value="state.att.video"
               :error="fieldsStatus.video.error"
               :status="fieldsStatus.video.status"
               :label="$t('linkVideo')"
               type="text"
               @update:validator="validateVideo()"/>
        <small>{{ $t('linkDiCondivisioneYoutube') }}</small>
        <hr>
        <div class="responsive-iframe">
          <iframe
              v-if="state.att.video!=''"
              :src="'https://www.youtube.com/embed/'+extractVideoID(state.att.video)+';controls=0'"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              frameborder="0"
              height="315"
              referrerpolicy="strict-origin-when-cross-origin"
              :title="$t('youtubeVideoPlayer')"
              width="560"
          ></iframe>
        </div>

      </div>
    </div>

  </div>


</template>


<style scoped>
.responsive-iframe {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.responsive-iframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>