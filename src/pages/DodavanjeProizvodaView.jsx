import React from "react";

function dodavanjeProizvodaComponent() {
  return <div>dodavanjeProizvodaComponent</div>;
}

export default dodavanjeProizvodaComponent;

/* <template>
  <ion-header
    ><ion-toolbar>
      <ion-title>Dodaj robu na stanje</ion-title>
    </ion-toolbar></ion-header
  >
  <ion-content class="ion-padding">
    <ion-item>
      <ion-label position="stacked">Izaberi proizvod</ion-label>
      <ion-select v-model="izabranArtikal" placeholder="Izaberi proizvod">
        <ion-select-option
          v-for="artikal in artikli.values"
          :key="artikal.id"
          :value="artikal.id"
          >{{ artikal.name }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Kolicina</ion-label>
      <ion-input
        ref="input"
        type="number"
        placeholder="Kolicina"
        v-model="kolicinaProizvoda"
      ></ion-input>
    </ion-item>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="cancel()">Nazad</ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="confirm()">Dodaj</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { getArtikli, addKolicina } from "@/services/dataservices";
import { defineComponent, ref, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import {
  IonFooter,
  IonLabel,
  IonInput,
  IonItem,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonTitle,
  // IonItemGroup,
} from "@ionic/vue";

export default defineComponent({
  name: "dodavanjeStanja",
  components: {
    IonFooter,
    IonLabel,
    IonInput,
    IonItem,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonTitle,
  },
  setup(props, { emit }) {
    const router = useRouter();
    let artikli = ref<any>([]);

    const izabranArtikal = ref();
    const kolicinaProizvoda = ref<number>(0);

    onBeforeMount(async () => {
      artikli.value = await getArtikli();
    });

    const cancel = () => {
      emit("cancel");
    };

    const confirm = async () => {
      addKolicina(izabranArtikal.value, Number(kolicinaProizvoda.value));
      emit("confirm");
    };

    return {
      router,
      props,
      cancel,
      confirm,
      izabranArtikal,
      kolicinaProizvoda,
      artikli,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Style dodaj-sastojak button to be small beautiful */
// .dodaj-sastojak {
//   margin-top: 10px;
//   width: 30px;
//   height: 30px;
//   border-radius: 50%; */}
//   font-size: 20px;
//   font-weight: bold;
// }
// /* Style item */
// ion-item {
//   --padding-start: 0;
//   --padding-end: 0;
//   --inner-padding-start: 0;
//   --inner-padding-end: 0;
// }

// /* Style ion-item-group give it a separation a box and inside of box and put two inputs onto same line*/
// ion-item-group {
//   margin-top: 10px;
//   margin-bottom: 10px;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   padding: 10px;
//   display: grid;
// }
// </style>
