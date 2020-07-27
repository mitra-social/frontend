<template>
  <v-carousel
    :value="getSelectedAttachmentIndex"
    :show-arrows="images.length > 1"
    :hide-delimiters="images.length < 2"
  >
    <v-carousel-item
      v-for="(attach, index) in images"
      :key="index"
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
      <v-img
        class="mx-auto"
        max-width="75%"
        max-height="100%"
        :src="attach.url"
        :lazy-src="attach.url"
        :alt="attach.title"
        :width="attach.width ? attach.width + 'px' : 'auto'"
        :height="attach.height ? attach.height + 'px' : 'auto'"
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
  @dialogAttachmentsStore.Getter
  public getSelectedAttachmentIndex!: number;

  @dialogAttachmentsStore.Getter
  public getSelectedAttachments!: Attachment[];

  get images(): Attachment[] {
    return this.getSelectedAttachments.filter(
      ($) => $.type && $.type.startsWith("image/")
    );
  }
}
</script>

<style lang="scss" scoped>
.v-dialog__content {
  align-items: flex-start;
}
</style>
