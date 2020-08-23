<template>
  <a :href="url" target="_blank">{{ title && title !== "" ? title : url }}</a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Attachment } from "@/model/attachment";

@Component
export default class AttachmentSimpleLink extends Vue {
  /************************
   * component properties
   ************************/

  @Prop() readonly attach!: Attachment;

  /**********************
   * computed properties
   **********************/
  get title(): string {
    return this.attach.title ?? this.attach.url;
  }

  get url(): string {
    return this.attach.url;
  }
}
</script>
