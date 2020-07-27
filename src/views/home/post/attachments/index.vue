<template>
  <div>
    <v-row align="center" justify="center">
      <v-col
        v-for="(attach, index) in getAttachments"
        :key="index"
        class="d-flex child-flex justify-center"
        :md="
          getAttachments.length < 2 ? 12 : getAttachments.length === 2 ? 6 : 4
        "
        sm="12"
      >
        <v-card flat tile>
          <component
            :is="getMediaComponent(attach)"
            :attach="attach"
            :postIndex="postIndex"
            :attachIndex="index"
            :isSingle="getAttachments.length === 1"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";

import AttachmentImage from "./AttachmentImage.vue";
import AttachmentSimpleLink from "./AttachmentSimpleLink.vue";
import { Attachment } from "@/model/attachment";
import { namespace } from "vuex-class";

const dialogAttachmentsStore = namespace("DialogAttachments");

@Component({
  components: {
    AttachmentImage,
    AttachmentSimpleLink,
  },
})
export default class ActivityStreamsAttachments extends Vue {
  @Prop() readonly attachments!: Array<ActivityObject | URL>;
  @Prop() readonly postIndex!: number;

  @dialogAttachmentsStore.Action
  public addAttachmentsAction!: (attachments: any) => void;

  get getAttachments(): Attachment[] {
    if (!this.attachments) {
      return [];
    }
    const normalizedAttachments: Array<ActivityObject | URL> = Array.isArray(
      this.attachments
    )
      ? this.attachments
      : [this.attachments];

    const attachments = normalizedAttachments
      .map<Attachment | undefined>((param: ActivityObject | URL):
        | Attachment
        | undefined => {
        let object = param as ActivityObject;

        if (object.preview) {
          object = object.preview as ActivityObject;
        }

        if (object.type === "Link") {
          const link = object as Link;
          const href: string = link.href.toString();
          return {
            url: href,
            type: link.mediaType,
            title: link.name,
            width: link.width,
            height: link.height,
          };
        }

        if ((param as ActivityObject).type) {
          const url: Link | URL | undefined = !Array.isArray(object.url)
            ? object.url
            : object.url[0];

          if (url === undefined) {
            return undefined;
          }
          if (url.href) {
            const link = url as Link;
            const href: string = link.href.toString();
            return {
              url: href,
              type: link.mediaType,
              title: link.name,
              width: link.width,
              height: link.height,
            };
          }

          return {
            url: url.toString(),
            type: object.mediaType,
            title: object.name,
          };
        }

        return { url: param.toString(), title: object.name };
      })
      .filter((item) => item !== undefined)
      .map((item) => item as Attachment);
    this.addAttachmentsAction({ index: this.postIndex, attachments });
    return attachments;
  }

  public getMediaComponent(attach: Attachment): string | undefined {
    if (attach.type && attach.type.startsWith("image/")) {
      return "AttachmentImage";
    }

    return "AttachmentSimpleLink";
  }
}
</script>
<style lang="scss" scoped>
.v-row {
  justify-content: center;
}
</style>
