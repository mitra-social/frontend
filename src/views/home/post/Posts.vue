<template>
  <div class="post-container" v-if="getPosts">
    <Article
      v-for="(post, index) in getPosts.default.items"
      :key="index"
      :article="post"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Article from "./Article.vue";
import { Collection } from "../../../model/collection";

const posts = namespace("Posts");

@Component({
  components: {
    Article
  }
})
export default class MitraPosts extends Vue {
  @posts.Getter
  public getPosts!: Collection;

  @posts.Action
  public fetchPosts!: () => void;

  created() {
    this.fetchPosts();
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}
</style>
