<template>
  <v-row>
    <v-col
      v-for="(attach, index) in getAttachments"
      :key="index"
      class="d-flex child-flex"
      cols="8"
    >
      <v-img :src="attach.url" :lazy-src="attach.url" aspect-ratio="1">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject } from "activitypub-objects";
import { Attachment } from "@/model/attachment";
import { Link } from "activitypub-objects/dist";

@Component
export default class ActivityStreamsAttachments extends Vue {
  @Prop() readonly attachments!: Array<ActivityObject | URL>;

  get getAttachments(): Attachment[] {
    console.log(this.attachments);
    const normalizedAttachments: Array<ActivityObject | URL> = Array.isArray(
      this.attachments
    )
      ? this.attachments
      : [this.attachments];

    const foo: Array<Attachment | undefined> = normalizedAttachments.map<
      Attachment | undefined
    >((param: ActivityObject | URL): Attachment | undefined => {
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
    });

    return foo
      .filter((item) => item !== undefined)
      .map((item) => item as Attachment);
  }
}
</script>
<style lang="scss" scoped></style>
