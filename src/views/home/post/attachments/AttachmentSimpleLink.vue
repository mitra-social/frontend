<template>
  <a :href="url" target="_blank">{{ title && title !== "" ? title : url }}</a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class AttachmentSimpleLink extends Vue {
  @Prop() readonly url!: string;
  @Prop() readonly title!: string;
}
</script>
<style lang="scss" scoped></style>
