<template>
  <v-app>
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

import Header from "@/components/layout/MitraHeader.vue";

@Component({
  components: {
    Header
  }
})
export default class MitraHeader extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.v-application {
  width: 100%;
  height: 100vh;
}

header {
  height: 50px;
}

main {
  flex: 1 1 auto;
  min-height: 0px;
  display: flex;
  flex-wrap: wrap;
}
</style>
