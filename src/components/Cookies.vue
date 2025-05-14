<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {router} from "../routes.ts";

const props = defineProps({
  showButton: {
    type: Boolean,
    default: true
  }
})


const state = reactive({
  showButton: props.showButton,
  accepted: false,
  funzionali: false,
  analisi: false,
  prestazionali: false,
})

const accept = () => {
  setCookie("cookielawinfo-checkbox-analytics", "" + state.analisi, 330);
  setCookie("cookielawinfo-checkbox-functional", "" + state.funzionali, 330);
  setCookie("cookielawinfo-checkbox-performance", "" + state.prestazionali, 330);
  setCookie("cookielawinfo-checkbox-necessary", "true", 330);
  setCookie("viewed_cookie_policy", "true", 330);

  state.accepted = true;
}

const acceptAll = () => {

  state.funzionali = true;
  state.analisi = true;
  state.prestazionali = true;
  accept();
}

const navToInfo = () => {
  router.push("/privacy");
}

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`) || [];
  if (parts.length === 2) {
    const part = parts.pop();
    return part ? part.split(';').shift() : null;
  }
  return null;
}

setTimeout(() => {
  state.accepted = (getCookie("viewed_cookie_policy") === "true" ? true : false) || false;
  if (!state.accepted) {
    $("#cookiesModal").modal('show');
  }
}, 1000);


const handleScroll = () => {
  if (!props.showButton) {
    state.showButton = false;
    return;
  }

  if (window.scrollY > 200) {
    state.showButton = false;
  } else {
    state.showButton = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

/*watch(
    () => state.accepted,
    (newValue:boolean) => {
      if (!newValue) {
        $("#cookiesModal").modal('show');
      }

    }
);*/


</script>

<template>
  <div v-if="state.showButton" class="fixed-bottom p-3 ">
    <button class="btn btn-dark rounded-circle" data-bs-target="#cookiesModal" data-bs-toggle="modal" type="button" @click="accept"><i class="fa-solid fa-cookie-bite"></i></button>
  </div>

  <div id="cookiesModal" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">

          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>
            {{ $t('questoSitoEGliStrumentiTerziDaQuestoUtilizzatiSiAv') }}
          </p>
          <p>
            {{ $t('seVuoiSaperneDiPiONegareIlConsensoATuttiOAdAlcuniC') }}
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button" @click="navToInfo">{{ $t('maggioriInfo') }}</button>
          <button class="btn btn-primary" data-bs-dismiss="modal" data-bs-target="#cookiesCustom" data-bs-toggle="modal" type="button">{{ $t('personalizza') }}</button>
          <button class="btn btn-primary" data-bs-dismiss="modal" type="button" @click="acceptAll">{{ $t('accettaTutto') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div id="cookiesCustom" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">{{ $t('informativaSullaPrivacy') }}</h1>
          <button class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body">
          <p>
            {{ $t('questoSitoWebUtilizzaICookiePerMigliorareLaTuaEspe') }}
          </p>

          <Fieldset :collapsed="true" :toggleable="true" legend="Altre info">
            <template #legend>
              <div class="fs-6 text-start fw-normal">
                <span class="font-bold">{{ $t('altreInfo') }}</span>
              </div>
            </template>
            <p>
              {{ $t('utilizziamoAncheCookieDiTerzePartiCheCiAiutanoAdAn') }}
            </p>
          </Fieldset>


        </div>

        <div>
          <div id="coockies" class="accordion accordion-flush">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <div class="accordion-button collapsed" data-bs-target="#necessari" data-bs-toggle="collapse" type="button">
                  <div class="d-flex justify-content-between w-100 ">
                    <div>
                      {{ $t('necessari') }}
                    </div>
                    <div>
                      {{ $t('sempreAbilitato') }}
                    </div>
                  </div>
                </div>
              </h2>
              <div id="necessari" class="accordion-collapse collapse" data-bs-parent="#coockies">
                <div class="accordion-body">
                  <p>
                    {{ $t('questiCookieSonoNecessariPerIlFunzionamentoDelSito') }}

                    <Fieldset :collapsed="true" :toggleable="true" legend="Altre info">
                      <template #legend>
                        <div class="fs-6  fw-normal">
                          <span class="font-bold">{{ $t('altreInfo') }}</span>
                        </div>
                      </template>
                      <p>
                        {{ $t('diSolitoVengonoImpostatiSoloInRispostaAlleAzioniDa') }}
                      </p>
                    </Fieldset>
                  </p>
                  <ScrollPanel style="width: 100%; height: 200px">
                    <table class="table table-striped table-bordered table-sm">
                      <thead class="table-dark">
                      <tr>
                        <!--suppress AllyHtmlVueInspection -->
                        <th>Cookie</th>
                        <th>{{ $t('durata') }}</th>
                        <th>{{ $t('descrizione') }}</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>cookielawinfo-checkbox-analytics</td>
                        <td>{{ $t('11Mesi') }}</td>
                        <td>
                          {{ $t('ilCookieVieneUtilizzatoPerMemorizzareIlConsensoDel2') }}
                        </td>
                      </tr>
                      <tr>
                        <td>cookielawinfo-checkbox-functional</td>
                        <td>{{ $t('11Mesi') }}</td>
                        <td>
                          {{ $t('ilCookieVieneUtilizzatoPerMemorizzareIlConsensoDel') }}
                        </td>
                      </tr>
                      <tr>
                        <td>cookielawinfo-checkbox-necessary</td>
                        <td>{{ $t('11Mesi') }}</td>
                        <td>
                          {{ $t('ilCookieVengonoUtilizzatiPerMemorizzareIlConsensoD2') }}
                        </td>
                      </tr>
                      <tr>
                        <td>cookielawinfo-checkbox-performance</td>
                        <td>{{ $t('11Mesi') }}</td>
                        <td>
                          {{ $t('ilCookieVengonoUtilizzatiPerMemorizzareIlConsensoD') }}
                        </td>
                      </tr>
                      <tr>
                        <td>viewed_cookie_policy</td>
                        <td>{{ $t('11Mesi') }}</td>
                        <td>
                          {{ $t('ilCookieVieneUtilizzatoPerMemorizzareSeLutenteHaAc') }}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </ScrollPanel>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <div class="accordion-button collapsed" data-bs-target="#funzionali" data-bs-toggle="collapse" type="button">
                  <div class="d-flex justify-content-between w-100 ">
                    <div>
                      {{ $t('funzionali') }}
                    </div>
                    <div>
                      <div class="form-check form-switch">
                        <input v-model="state.funzionali" checked class="form-check-input" role="switch" type="checkbox">
                      </div>
                    </div>
                  </div>
                </div>
              </h2>
              <div id="funzionali" class="accordion-collapse collapse" data-bs-parent="#coockies">
                <div class="accordion-body">
                  <p>
                    {{ $t('questiCookieConsentonoAlSitoDiFornireFunzionalitEP') }}
                  </p>
                  <b>{{ $t('nessunCoockiesUtilizzato') }}</b>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <div class="accordion-button collapsed" data-bs-target="#prestazionali" data-bs-toggle="collapse" type="button">
                  <div class="d-flex justify-content-between w-100 ">
                    <div>
                      {{ $t('prestazionali') }}
                    </div>
                    <div>
                      <div class="form-check form-switch">
                        <input v-model="state.prestazionali" checked class="form-check-input" role="switch" type="checkbox">
                      </div>
                    </div>
                  </div>
                </div>
              </h2>
              <div id="prestazionali" class="accordion-collapse collapse" data-bs-parent="#coockies">
                <div class="accordion-body">
                  <p>
                    {{ $t('cookieDiPrestazionesempreAttiviquestiCookieCiPerme') }}
                  </p>
                  <b>{{ $t('nessunCoockiesUtilizzato') }}</b>
                </div>
              </div>
            </div>


            <div class="accordion-item">
              <h2 class="accordion-header">
                <div class="accordion-button collapsed" data-bs-target="#analisi" data-bs-toggle="collapse" type="button">
                  <div class="d-flex justify-content-between w-100 ">
                    <div>
                      {{ $t('analisi') }}
                    </div>
                    <div>
                      <div class="form-check form-switch">
                        <input v-model="state.analisi" checked class="form-check-input" role="switch" type="checkbox">
                      </div>
                    </div>
                  </div>
                </div>
              </h2>
              <div id="analisi" class="accordion-collapse collapse" data-bs-parent="#coockies">
                <div class="accordion-body">
                  <p>
                    {{ $t('iCookieAnaliticiVengonoUtilizzatiPerCapireComeIVis') }}
                  </p>
                  <b>{{ $t('nessunCoockiesUtilizzato') }}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" data-bs-dismiss="modal" type="button" @clicl="accept">{{ $t('accettaESalva') }}</button>
        </div>
      </div>
    </div>
  </div>

  <!--  <div v-if="coockies!='true'" class="alert alert-info m-3" role="alert">
      Questo sito fa uso di Cookies necessari per il suo funzionamento. Maggiori informazioni nella nostra <a href="/privacy">Privacy Policy</a>
      <button class="btn btn-success ms-5" type="button" @click="accept">Accetta</button>
      <a class="btn btn-danger ms-5" href="http://www.google.it" role="button">Rifiuta</a>
    </div>-->
</template>

<style scoped>

</style>