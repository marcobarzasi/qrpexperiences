<script setup lang="ts">
import {useStore} from '../store/Store.ts'
import CallAvatar from "./CallAvatar.vue";
import {router} from "../routes.ts";
import {onMounted, ref} from "vue";
import {version} from "../../package.json";

const mode = import.meta.env.MODE;

const globalState = useStore();
const op = ref();
const q = ref();
const ver = version;


const showHelpBalloon = () => {
  if (op.value) {
    op.value.show();
  }
};

const search = () => {
  const callRegex = /^\d*[a-zA-Z]{1,}\d+[a-zA-Z]{1,}\/*\w*$/;
  const wwlRegex = /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{2}$/;

  if (q.value && wwlRegex.test(q.value)) {
    router.push({name: 'list', params: {q: q.value}});
    return;
  } else if (q.value && callRegex.test(q.value)) {
    router.push({name: 'myPage', params: {id: q.value}});
    return;
  } else {
    router.push({name: 'list', params: {q: q.value}});
  }

  if (q.value)

    router.push({name: 'search'});
}

onMounted(() => {
  showHelpBalloon();
});


</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-1">
    <div class="container-fluid">

      <div class="navbar-brand">
        <div class="d-flex  align-items-center" style="cursor:pointer" @click="router.push({name:'home'})">
          <Avatar image="/images/logo3.png" shape="circle" size="xlarge"/>
          <div class="d-flex flex-column mt-2 ms-2">
            <!--suppress AllyHtmlVueInspection -->
            <div class="fs-4 lh-1">Portable</div>
            <!--suppress AllyHtmlVueInspection -->
            <div class="fs-6">Experiences</div>
            <div v-if="mode!='prod'" class="text-center badge  text-bg-warning">Questo è un sito di SVILUPPO</div>

          </div>
        </div>
      </div>


      <button v-if="!globalState.printMode" class="navbar-toggler" data-bs-target="#navbarSupportedContent" data-bs-toggle="collapse" type="button">
        <span class="navbar-toggler-icon"></span>

      </button>

      <div v-if="globalState.printMode"><small>Powered by</small> <b>radioexperiences.net</b></div>

      <div v-if="!globalState.printMode" id="navbarSupportedContent" class="collapse navbar-collapse">
        <div class="w-100">


          <div class="d-flex justify-content-between align-items-center">

            <div class="d-flex me-2 ms-5">
              <button class="btn btn-outline-primary d-flex " @click="router.push({name:'home'})"><i class="fa-solid fa-house mt-1"></i> <!--suppress AllyHtmlVueInspection -->
                <span class="ms-2 d-none d-lg-table-cell">Home</span></button>
            </div>
            <div class="">
              <button class="btn btn-outline-primary d-flex " @click="router.push({name:'map'})"><i class="fa-solid fa-map-location-dot mt-1"></i><span class="ms-2  d-none d-lg-table-cell"> {{ $t('mappa') }}</span></button>
            </div>
            <div class="d-flex ms-2 d-none d-xl-table-cell">
              <a class="btn btn-outline-primary d-flex " href="https://radioexperiences.net"><span class="text-nowrap"><b>{{ $t('radio') }}</b> <!--suppress AllyHtmlVueInspection -->
                <small>Experiences</small></span></a>
            </div>
            <div class="">
              <button v-if="globalState.user.call!=''" class="btn btn-outline-primary d-lg-none" @click="router.push({name:'myPage', params:{id:globalState.user.call}})"><i class="fa-regular fa-address-card"></i></button>
            </div>


            <div class="flex-fill me-5 ms-2   d-none d-lg-table-cell">
              <form class="d-flex" role="search">
                <input v-model="q" :placeholder="$t('callLocatoreNomeDiUnLuogo')" class="form-control me-2" type="search">
                <button class="btn btn-outline-success" type="submit" @click="search">{{ $t('cerca') }}</button>
              </form>
            </div>

            <div class="d-flex fs-4 text-muted ">

              <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
                <li v-if="globalState.user.call==''" class="nav-item dropdown">
                  <RouterLink :to="{name:'login'}" class="nav-link me-3"><i class="fa-regular fa-user"></i></RouterLink>
                </li>

                <li v-if="globalState.user.role=='MANAGER'" class="nav-item dropdown  d-none d-lg-table-cell">
                  <a aria-expanded="false" class=" nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
                    <i class="fa-solid fa-screwdriver-wrench"></i>
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <RouterLink :to="{name:'users'}" class="dropdown-item custom-dropdown-item mb-2">{{ $t('utenti') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'emails'}" class="dropdown-item custom-dropdown-item mb-2">{{ $t('TestiEmail') }}</RouterLink>
                    </li>
                    <li v-if="mode!='prod'">
                      <RouterLink :to="{name:'translations'}" class="dropdown-item custom-dropdown-item mb-2">{{ $t('Traduzioni') }}</RouterLink>
                    </li>
                  </ul>
                </li>


                <li v-if="globalState.user.call!=''" class="nav-item dropdown   d-none d-lg-table-cell">
                  <RouterLink :to="{name:'edit'}" class="nav-link me-3"><i class="fa-regular fa-square-plus"></i></RouterLink>
                </li>
                <li v-if="globalState.user.call!=''" class="nav-item dropdown  d-none d-lg-table-cell">
                  <a aria-expanded="false" class="d-flex align-items-center nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
                    <CallAvatar :userCall="globalState.user.call"></CallAvatar>
                    <!--                    <Avatar :label="globalState.user.call.charAt(0)" class="mr-2" shape="circle" style="background-color: #ece9fc; color: #2a1261"/>-->
                    {{ globalState.user.call }}
                  </a>
                  <ul class="dropdown-menu text-nowrap">
                    <li>
                      <RouterLink :to="{name:'myPage', params:{id:globalState.user.call}}" class="dropdown-item custom-dropdown-item  mb-2"><i class="fa-regular fa-address-card"></i> {{ $t('leMiaPagina') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'myActivity'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-tower-cell"></i> {{ $t('leMieAttivit') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'myAwards'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-certificate"></i> {{ $t('iMieiAttestati') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'myStatistics'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-chart-column"></i> {{ $t('leMieStatistiche') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'myBookmark'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-bookmark"></i> {{ $t('iMieiPreferiti') }}</RouterLink>
                    </li>
                    <li>
                      <hr class="dropdown-divider">
                    </li>
                    <li>
                      <RouterLink :to="{name:'settings'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-gear"></i> {{ $t('impostazioni') }}</RouterLink>
                    </li>
                    <li>
                      <hr class="dropdown-divider">
                    </li>
                    <li>
                      <a :href="'/server/api/login/logout.php?user='+globalState.user.call" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-right-from-bracket"></i> {{ $t('esci') }}</a>
                    </li>
                  </ul>
                </li>


                <li class="nav-item dropdown ms-3  d-none d-lg-table-cell">
                  <a aria-expanded="false" class=" align-items-center nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">
                    <i class="fa-solid fa-ellipsis"></i>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-lg-end">

                    <li>
                      <a class="dropdown-item custom-dropdown-item mb-2" href="https://radioexperiences.net/ticket" target="_blank"><i class="fa-solid fa-headset"></i> {{ $t('assistenza') }}</a>
                    </li>
                    <li>
                      <a class="dropdown-item custom-dropdown-item mb-2" href="mailto:portable@radioexperiences.net" target="_blank"><i class="fa-regular fa-envelope"></i> {{ $t('contatti') }}</a>
                    </li>
                    <li>
                      <RouterLink :to="{name:'guideline'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-book"></i> {{ $t('lineeGuida') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'rules'}" class="dropdown-item custom-dropdown-item mb-2"><i class="fa-solid fa-scale-balanced"></i> {{ $t('regolamento') }}</RouterLink>
                    </li>
                    <hr>
                    <li>
                      <RouterLink :to="{name:'termini'}" class="dropdown-item custom-dropdown-item mb-2">{{ $t('terminiDelServizio') }}</RouterLink>
                    </li>
                    <li>
                      <RouterLink :to="{name:'privacy'}" class="dropdown-item custom-dropdown-item mb-2">{{ $t('informativaSullaPrivacy') }}</RouterLink>
                    </li>
                    <hr>
                    <li>
                      <div class="ms-3 me-3">
                        <small class="float-end" style="font-size:10px">{{ ver }}</small>
                        <span style="font-size:10px">Powered by</span><br>radioexperiences.net
                      </div>
                    </li>
                  </ul>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

</template>

<style scoped>
.custom-dropdown-item:hover {
  background-color: #d3d3d3; /* Change this to your desired hover color */
  color: #000; /* Optional: Change the text color on hover */

}
</style>