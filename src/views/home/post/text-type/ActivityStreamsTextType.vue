<template>
  <div>
    <div v-html="data.content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Article } from "activitypub-objects";

@Component
export default class ActivityStreamsTextType extends Vue {
  /************************
   * component properties
   ************************/
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
