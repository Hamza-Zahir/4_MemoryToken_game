<template>
  <div>
    <div
      class="bg-dark text-light p-2 d-flex justify-content-around align-items-center"
    >
      <h2 class="">Memory Tokens</h2>
      <div
        class="btn btn-primary"
        :class="CurrentAccount && ChainId != 4 ? 'btn-warning' : ''"
        @click="connectMetamask"
      >
        {{
          CurrentAccount && ChainId == 4
            ? `${CurrentAccount.slice(0, 5)}...${CurrentAccount.slice(
                CurrentAccount.length - 4
              )}`
            : CurrentAccount && ChainId != 4
            ? "network erore"
            : " Conect Wallet"
        }}
      </div>
    </div>
    <div class="">
      <h2 class="my-3 text-center">Start matching now!</h2>
      <div class="text-center">
        <div
          class="cards mt-4 d-flex justify-content-center flex-wrap col-10 mx-auto"
        >
          <div
            v-for="(box, i) in cardArray"
            :key="i"
            class="box"
            @click="
              (e) => {
                if (!cardsChosen.includes(box.img)) {
                  addClacCrotate(e, box.img);
                }
              }
            "
          >
            <img
              v-if="!cardsChosen.includes(box.img)"
              src="../assets/images/blank.png"
              alt=""
              class="w-100 front"
            />
            <img
              v-if="!cardsChosen.includes(box.img)"
              :src="require(`../assets/images/${box.img}`)"
              alt=""
              class="w-100 back"
            />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <h3 class="text-center">Tokens Collected: 2</h3>
    <div class="cards d-flex col-10 mx-auto flex-wrap">
      <div class="" v-for="(img, i) in TokenUrlsOfUser" :key="`token-${i}`">
        <img :src="require(`../assets/images/${img}`)" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import cardesData from "../json/imges.json";

export default {
  data() {
    return {
      CandidateSelectId: "",
      loding: false,
      cardArray: cardesData,
      pair: [],
      cardsChosen: [],
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
    ...mapGetters(["TokenUrlsOfUser"]),
  },
  mounted() {
    this.getALLTokenURIOfUser();
    this.sortarray();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    ...mapActions(["setTokenToBlockchain"]),
    ...mapActions(["getTokenURIOfUser"]),
    sortarray() {
      this.cardArray = cardesData.sort(() => 0.5 - Math.random());
    },
async getALLTokenURIOfUser(){
await this.checkWalletIsConnected();
await this.getTokenURIOfUser();
},
    async addClacCrotate(e, url) {
      if (this.pair.length < 2) {
        await e.target.parentElement.classList.add("rotate");
        this.pair.push(url);

        if (this.pair[0] == this.pair[1]) {
          this.cardsChosen.push(url);
          this.pair = [];
          await this.setTokenToBlockchain(url).then(async () => {
            await this.getTokenURIOfUser()
          });
        }
      } else if (this.pair.length >= 2) {
        this.pair = [];
        this.pair.push(url);
        const allBoxs = document.querySelectorAll(".box");
        allBoxs.forEach((el) => {
          el.classList.remove("rotate");
        });
        e.target.parentElement.classList.add("rotate");
      }
    },
  },
};
</script>
<style scoped></style>
