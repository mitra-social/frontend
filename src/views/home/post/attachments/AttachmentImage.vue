<template>
  <div class="image-container">
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Attachment } from "@/model/attachment";
import { DialogSettings } from "@/model/dialog-settings";
import { SelectedAttachmentParam } from "@/model/selected-attachment-param";

const dialogAttachmentsStore = namespace("DialogAttachments");
const dialogStore = namespace("Dialog");

@Component
export default class AttachmentImage extends Vue {
  /************************
   * components properties
   ************************/
  @Prop() readonly attach!: Attachment;
  @Prop() readonly attachIndex!: number;
  @Prop() readonly isSingle!: boolean;
  @Prop() readonly postIndex!: number;

  /**********************
   * computed properties
   **********************/
  get url(): string {
    return this.attach.url;
  }

  get title(): string {
    return this.attach.title ?? "Attachment image";
  }

  /**********************
   * store actions
   **********************/
  @dialogStore.Action
  public toggleDialog!: ({ title, component }: DialogSettings) => Promise<void>;

  @dialogAttachmentsStore.Action
  public setSelectedAttachmentAction!: (
    indexes: SelectedAttachmentParam
  ) => Promise<void>;

  /**********************
   * public functions
   **********************/
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
.image-container {
  cursor: pointer;
  background-color: transparent;
}

.single-attach {
  max-width: 400px;
  margin: auto;
}
</style>
