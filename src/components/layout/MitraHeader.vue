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
import { namespace } from "vuex-class";

import { User } from "@/model/user";

const userStore = namespace("User");

@Component
export default class MitraHeader extends Vue {
  @userStore.Getter
  public getUser!: User;

  get icon(): string | undefined {
    return undefined;
  }
}
</script>

<style lang="scss" scoped>
.mitra-toolbar {
  width: 100%;
  height: 100%;
}
.header-logo {
  height: 100%;
}
</style>
