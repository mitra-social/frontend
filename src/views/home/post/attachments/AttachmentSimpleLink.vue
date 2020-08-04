<template>
  <a :href="url" target="_blank">{{ title && title !== "" ? title : url }}</a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Attachment } from "@/model/attachment";

@Component
export default class AttachmentSimpleLink extends Vue {
  @Prop() readonly attach!: Attachment;

  get url(): string {
    return this.attach.url;
  }

  get title(): string {
    return this.attach.title ?? this.attach.url;
  }
}
</script>
<style lang="scss" scoped></style>
