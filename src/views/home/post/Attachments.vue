<template>
  <div v-if="getAttachments.length > 0">
    <div v-for="(attachment, index) in getAttachments" :key="index">
      <a :href="attachment.url">{{ attachment.url }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject } from "activitypub-objects";
import { Attachment } from "@/model/attachment";
import { Link } from "activitypub-objects/dist";

@Component
export default class ActivityStreamsAttachments extends Vue {
  @Prop() readonly attachments!: Array<ActivityObject | URL>;

  get getAttachments(): Array<Attachment> {
    const normalizedAttachments: Array<ActivityObject | URL> = Array.isArray(
      this.attachments
    )
      ? this.attachments
      : [this.attachments];

    const foo: Array<Attachment | undefined> = normalizedAttachments.map<
      Attachment | undefined
    >((param: ActivityObject | URL, index: number): Attachment | undefined => {
      if ((param as ActivityObject).type) {
        const object = param as ActivityObject;
        const objectUrl: Link | URL | undefined = !Array.isArray(object.url)
          ? object.url
          : object.url[0];

        if (objectUrl === undefined) {
          return undefined;
        }

        const url: URL = (objectUrl as Link).type
          ? (objectUrl as Link).href
          : (objectUrl as URL);

        return new Attachment(url.href, object.mediaType);
      }

      return new Attachment((param as URL).href, undefined);
    });

    return foo
      .filter((item) => item !== undefined)
      .map((item) => item as Attachment);
  }
}
</script>
<style lang="scss" scoped></style>
