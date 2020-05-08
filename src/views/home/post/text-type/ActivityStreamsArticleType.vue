<template>
  <TextType />
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ActivityStreamsTextTypeMixin from "./ActivityStreamsTextTypeMixin";

@Component
export default class ActivityStreamsArticleType extends Mixins(
  ActivityStreamsTextTypeMixin
) {}
</script>
<style lang="scss" scoped>
.post {
  margin: 5px;
}

.v-card__text {
  width: inherit;
}
</style>
