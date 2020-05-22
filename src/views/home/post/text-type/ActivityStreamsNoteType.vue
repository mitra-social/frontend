<template>
  <ActivityStreamsTextType :data="data" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { Article } from "activitypub-objects";

import ActivityStreamsTextType from "./ActivityStreamsTextType.vue";

@Component({
  components: {
    ActivityStreamsTextType
  }
})
export default class ActivityStreamsNoteType extends Vue {
  @Prop() private data!: Article;
}
</script>
