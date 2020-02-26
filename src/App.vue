<template>
  <v-app>
    <Header />
    <router-view />
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
