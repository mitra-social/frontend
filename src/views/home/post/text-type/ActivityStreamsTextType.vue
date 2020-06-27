<template>
  <div>
    <div v-html="data.content"></div>
    <Attachment
      v-if="data.attachments && data.attachments.length > 0"
      :attachments="data.attachments"
    ></Attachment>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Article } from "activitypub-objects";

import Attachment from "@/views/home/post/Attachments.vue";

@Component({
  components: {
    Attachment,
  },
})
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
