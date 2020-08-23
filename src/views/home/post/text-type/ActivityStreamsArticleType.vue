<template>
  <ActivityStreamsTextType :data="data" />
</template>

<script lang="ts">
import { Article } from "activitypub-objects";
import { Component, Prop, Vue } from "vue-property-decorator";

import ActivityStreamsTextType from "./ActivityStreamsTextType.vue";

@Component({
  components: {
    ActivityStreamsTextType,
  },
})
export default class ActivityStreamsArticleType extends Vue {
  /************************
   * component properties
   ************************/
  @Prop() private data!: Article;
}
</script>
