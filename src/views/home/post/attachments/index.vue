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
          <component :is="getMediaComponent(attach.type)" :url="attach.url" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";

import AttachmentImage from "./AttachmentImage.vue";
import { Attachment } from "@/model/attachment";

@Component({
  components: {
    AttachmentImage,
  },
})
export default class ActivityStreamsAttachments extends Vue {
  @Prop() readonly attachments!: Array<ActivityObject | URL>;

  get getAttachments(): Attachment[] {
    const normalizedAttachments: Array<ActivityObject | URL> = Array.isArray(
      this.attachments
    )
      ? this.attachments
      : [this.attachments];

    return normalizedAttachments
      .map<Attachment | undefined>((param: ActivityObject | URL):
        | Attachment
        | undefined => {
        const object = param as ActivityObject;

        if (object.type === "Link") {
          const href: string = (object as Link).href.toString();
          return new Attachment(href, object.mediaType);
        }

        if ((param as ActivityObject).type) {
          const url: Link | URL | undefined = !Array.isArray(object.url)
            ? object.url
            : object.url[0];

          if (url === undefined) {
            return undefined;
          }

          return new Attachment(url.toString(), object.mediaType);
        }

        return new Attachment(param.toString(), undefined);
      })
      .filter((item) => item !== undefined)
      .map((item) => item as Attachment);
  }

  public getMediaComponent(mediaType: string): string | undefined {
    if (mediaType.startsWith("image/")) {
      return "AttachmentImage";
    }
  }
}
</script>
<style lang="scss" scoped>
.v-row {
  justify-content: center;
}
</style>
