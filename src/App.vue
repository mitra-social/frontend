<template>
  <v-app class="app-container">
    <Dialog />
    <Notify />
    <header>
      <Header />
    </header>
    <main>
      <router-view />
    </main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Dialog from "@/components/ui/Dialog.vue";
import Header from "@/components/layout/MitraHeader.vue";
import Notify from "@/components/ui/Notify.vue";

@Component({
  components: {
    Dialog,
    Header,
    Notify,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

main {
  flex: 1 1 auto;
  min-height: 0px;
  display: flex;
  flex-wrap: wrap;
}

.app-container {
  width: 100%;
  height: 100vh;
}
</style>
