<template>
  <div>
    <v-img
      class="mx-auto"
      v-if="url"
      :class="isSingle ? 'single-attach' : 'mx-sm-auto'"
      :src="url"
      :lazy-src="url"
      :alt="title"
      width="100%"
      @click="openDialog()"
      v-set-attach-size="{ attach, maxSize: 400 }"
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { DialogSettings } from "@/model/dialog-settings";
import { Attachment } from "@/model/attachment";
import { SelectedAttachmentParam } from "@/model/selected-attachment-param";

const dialogStore = namespace("Dialog");
const dialogAttachmentsStore = namespace("DialogAttachments");

@Component
export default class AttachmentImage extends Vue {
  @Prop() readonly attach!: Attachment;
  @Prop() readonly postIndex!: number;
  @Prop() readonly attachIndex!: number;
  @Prop() readonly isSingle!: boolean;

  get url(): string {
    return this.attach.url;
  }

  get title(): string {
    return this.attach.title ?? "Attachment image";
  }

  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @dialogAttachmentsStore.Action
  public setSelectedAttachmentAction!: (
    indexes: SelectedAttachmentParam
  ) => Promise<void>;

  public openDialog() {
    this.setSelectedAttachmentAction({
      postIndex: this.postIndex,
      attachIndex: this.attachIndex,
    }).then(() =>
      this.toggleDialog({
        title: this.title,
        component: "AttachmentDialog",
        isFullsize: true,
      })
    );
  }
}
</script>
<style lang="scss" scoped>
.single-attach {
  max-width: 400px;
  margin: auto;
}
</style>
