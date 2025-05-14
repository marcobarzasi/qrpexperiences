<script lang="ts" setup>
import moment from "moment";
import {reactive, ref} from "vue";
import {server} from "./server.ts";
import {messages} from "./messages.ts";
import {Cropper} from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
import {useStore} from '../store/Store.ts'
import {i18n} from "./translations.ts";

const globalState = useStore();

const emit = defineEmits(['update:change'])
const props = defineProps<{
  path: string,
  enableCustom: boolean,
  isActivation: boolean,
  uid: string,
  commento: string,
  call: string,
}>();

//const { path } = toRefs(props);

//const cropComponent=ref<InstanceType<typeof Cropper>>();
//const cropComponent=ref();

const file = ref();
const imageToCrop = reactive({
  src: "",
  type: "",
  blob: "",
});

const state = reactive({
  reload: 0,
});


const reload = () => {
  state.reload++;
}
setTimeout(reload,1000);

function removeQSL() {
  messages.confirm(i18n.global.t("Vuoi usare la QSL standard?"), () => {
    let data = {
      user: globalState.user.call,
      path: props.path
    };

    let service = "profile.removeQSL";
    if (props.isActivation) {
      service = "attivazioni.removeQSL";
    }

    server.load(service, data, (response: any) => {
      if (response.success) {
        reload();
        emit('update:change');
      } else {
        messages.showError(response.error);
      }
    })
  })
}

const openCrop = () => {
  imageToCrop.src = '';
  imageToCrop.type = '';
  $('#cropModal').modal('show');
}


// This function is used to detect the actual image type,
function getMimeType(file: any, fallback = ""): string {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}

async function upload() {
  const form = new FormData();
  form.append('file-upload', imageToCrop.blob);
  form.append('path', props.path || "");
  form.append('type', imageToCrop.type);
  await fetch('/server/api/UploaderQSL.php', {
    method: 'POST',
    body: form,
  });

  //globalState.user.qsl_custom = true;
  $('#cropModal').modal('hide');
  reload();
  emit('update:change');
}


function crop(item: any) {
  if (item.canvas) {
    item.canvas.toBlob((blob: any) => {
      imageToCrop.blob = blob;
    }, imageToCrop.type);
  }
}

function loadImage(event: any) {
  // Reference to the DOM input element
  const {files} = event.target;
  // Ensure that you have a file before attempting to read it
  if (files && files[0]) {
    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (imageToCrop.src) {
      URL.revokeObjectURL(imageToCrop.src);
    }
    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0]);

    // 3. The steps below are designated to determine a file mime type to use it during the
    // getting of a cropped image from the canvas. You can replace it them by the following string,
    // but the type will be derived from the extension and it can lead to an incorrect result:
    //
    // this.image = {
    //    src: blob;
    //    type: files[0].type
    // }

    // Create a new FileReader to read this image binary data
    const reader = new FileReader();
    // Define a callback function to run, when FileReader finishes its job
    reader.onload = (e) => {
      // Note: arrow function used here, so that "this.image" refers to the image of Vue component
      if (e.target != null) {
        // Read image as base64 and set it as src:
        imageToCrop.src = blob;
        // Determine the image type to preserve it during the extracting the image from canvas:
        imageToCrop.type = getMimeType(e.target.result, files[0].type);
      }
    };
    // Start the reader job - read file as a data url (base64 format)
    reader.readAsArrayBuffer(files[0]);
  }
}

defineExpose({
  reload,
})

</script>

<template>
  <div class="w-100">
    <div class="d-flex justify-content-center">
      <Skeleton v-if="state.reload==0" class=" shadow-1" style="width:100%;height:330px"></Skeleton>
      <!--suppress AllyHtmlVueInspection -->
      <img :key="state.reload"  v-if="state.reload>0"
           :src="'/server/api/Api.php?service=qsl.preview&' +
            'reload='+state.reload+'&' +
             'call='+call+'&' +
              'calldx='+call+'&' +
               'modo=SSB&' +
                'banda=40M&' +
                 'data='+moment().format('YYYY-MM-DD')+'&' +
                  'rst=59&' +
                    'uid='+uid+'&' +
                     'commento='+commento"
           alt="QSL"
           style="width:100%;max-width:529px"
           class="card p-2 shadow-1"/>
    </div>
    <div class="">
      <!--
            <p class="">
              {{ $t('ePossibileProdurreUnaQslConUnaGraficaPiElaborataEP') }}<br>
              {{ $t('loSpazioInferioreUtilizzatoPerInserireIDatiDelQsoA') }}
            </p>
      -->
      <button :class="'w-100 btn btn-'+(enableCustom ? 'primary' : 'secondary')+' p-2 mt-3 w-50' + (enableCustom ? '' : ' disabled ')" type="button" @click="openCrop()">{{ $t('caricaQslPersonalizzata') }}</button>
      <br>
      <button class="w-100 btn btn-outline-primary w-50 p-2 mt-3" type="button" @click="removeQSL()">{{ $t('usaQslStandard') }}
      </button>
    </div>
  </div>

  <div id="cropModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('ritagliaImmagine') }}</h5>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <div class="" style="max-width:100%;overflow:hidden">
            <cropper :src="imageToCrop.src" :stencil-props="{aspectRatio: 529/337,	}" check-orientation class=""
                     @change="crop"
            />
          </div>
          <div v-if="imageToCrop.src==''" class="">
            <input ref="file" accept="image/*" class="form-control" type="file" @change="loadImage($event)"/>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">{{ $t('annulla') }}</button>
          <button class="btn btn-primary" type="button" @click="upload()">{{ $t('ritaglia') }}</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>/*
.upload-example {
  margin-top: 20px;
  margin-bottom: 20px;
  user-select: none;

  &__cropper {
    border: solid 1px #eee;
    min-height: 300px;
    max-height: 500px;
    width: 100%;
  }

  &__cropper-wrapper {
    position: relative;
  }

  &__reset-button {
    position: absolute;
    right: 20px;
    bottom: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    width: 42px;
    background: rgba(#3fb37f, 0.7);
    transition: background 0.5s;
    &:hover {
      background: #3fb37f;
    }
  }

  &__buttons-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 17px;
  }

  &__button {
    border: none;
    outline: solid transparent;
    color: white;
    font-size: 16px;
    padding: 10px 20px;
    background: #3fb37f;
    cursor: pointer;
    transition: background 0.5s;
    margin: 0 16px;
    &:hover,
    &:focus {
      background: #38d890;
    }
    input {
      display: none;
    }
  }

  &__file-type {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #0d0d0d;
    border-radius: 5px;
    padding: 0px 10px;
    padding-bottom: 2px;
    font-size: 12px;
    color: white;
  }
}*/
</style>