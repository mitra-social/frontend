<template>
  <div v-html="data.content"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Article } from "activitypub-objects";

@Component
export default class ActivityStreamsTextType extends Vue {
  @Prop() private data!: Article;
}
</script>
<style lang="scss" scoped>
.post {
  margin: 5px;
}

.v-card__text {
  width: inherit;
}
</style>
