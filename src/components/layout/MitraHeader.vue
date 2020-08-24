<template>
  <v-toolbar
    flat
    max-width
    :light="$vuetify.theme.dark"
    :dark="!$vuetify.theme.dark"
  >
    <div
      class="mitra-toolbar d-flex flex-row justify-space-between align-center"
    >
      <img
        class="header-logo"
        src="@/assets/mitra-logo-black.png"
        v-if="$vuetify.theme.dark"
      />
      <img class="header-logo" src="@/assets/mitra-logo-white.png" v-else />
    </div>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MitraHeader extends Vue {}
</script>

<style lang="scss" scoped>
.header-logo {
  height: 100%;
}

.mitra-toolbar {
  width: 100%;
  height: 100%;
}
</style>
