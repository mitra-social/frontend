<template>
  <v-toolbar flat :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark">
    <img
      class="header-logo"
      src="@/assets/mitra-logo-back.png"
      v-if="$vuetify.theme.dark"
    />
    <img class="header-logo" src="@/assets/mitra-logo-white.png" v-else />
    <div class="d-flex flex-row">
      <v-switch v-model="$vuetify.theme.dark" hide-details inset></v-switch>
      <v-icon v-if="$vuetify.theme.dark">mdi-moon-waning-crescent</v-icon>
      <v-icon v-else>mdi-white-balance-sunny</v-icon>
    </div>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MitraHeader extends Vue {
  private title = "Header";
}
</script>

<style lang="scss" scoped>
.header-logo {
  height: 100%;
}
</style>
