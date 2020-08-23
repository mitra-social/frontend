<template>
  <v-carousel
    :height="`${windowHeight - dialogHeaderHeight}px`"
    :value="getSelectedAttachmentIndex"
    :show-arrows="images.length > 1"
    :hide-delimiters="images.length < 2"
    v-resize="onResize"
  >
    <v-carousel-item
      class="carousel-item"
      reverse-transition="fade-transition"
      transition="fade-transition"
      v-for="(attach, index) in images"
      :key="index"
    >
      <div class="d-flex align-center image-container">
        <v-img
          class="mx-auto"
          :src="attach.url"
          :lazy-src="attach.url"
          :alt="attach.title"
          width="100%"
          v-set-attach-size="{ attach, maxSize: windowHeight }"
        >
          <template v-slot:placeholder>
            <v-row class="ma-0" align="center" justify="center">
              <v-progress-circular
                color="grey lighten-5"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Attachment } from "@/model/attachment";

const dialogAttachmentsStore = namespace("DialogAttachments");

@Component
export default class AttachmentDialog extends Vue {
  private windowHeight = 0;
  private dialogHeaderHeight = 78;

  /**********************
   * computed properties
   **********************/
  get images(): Attachment[] {
    return this.getSelectedAttachments.filter(($) => {
      return $.type && $.type.startsWith("image/");
    });
  }

  /**********************
   * store getters
   **********************/
  @dialogAttachmentsStore.Getter
  public getSelectedAttachmentIndex!: number;

  @dialogAttachmentsStore.Getter
  public getSelectedAttachments!: Attachment[];

  /**********************
   * store actions
   **********************/
  @dialogAttachmentsStore.Action
  public reset!: () => void;

  /**********************
   * Lifecycle hooks
   **********************/
  private destroyed() {
    this.reset();
  }

  /**********************
   * public functions
   **********************/
  public onResize() {
    this.windowHeight = window.innerHeight;
  }
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
  align-items: flex-start;
}
.image-container {
  overflow: scroll;
  display: inline-block;
  height: 100%;
  width: 100%;
}
</style>
