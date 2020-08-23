<template>
  <v-snackbar v-model="show" multi-line top :color="color" timeout="10000">
    <v-btn
      color="grey darken-4"
      icon
      absolute
      top
      right
      @click.native="show = false"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { Notify } from "@/model/notify";

@Component
export default class MitraNotify extends Vue {
  /**********************
   * data fields
   **********************/

  private color = "";
  private message = "";
  private show = false;

  /**********************
   * Lifecycle hooks
   **********************/
  private created(): void {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "Notify/setNofify") {
        const notification: Notify = state.Notify.notification;

        this.message = notification.message;
        this.color = notification.type.toString();
        this.show = true;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.post {
  margin: 5px;
}

.post-container {
  height: 100%;
  overflow-y: scroll;
}

.v-card__text {
  width: inherit;
}
</style>
