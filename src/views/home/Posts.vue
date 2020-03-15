<template>
  <div class="post-container" v-if="getPosts">
    <v-card v-for="(post, index) in getPosts.default.items" :key="index">
      <v-list-item>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            post.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mx-4"></v-divider>
      <v-card-text v-html="post.content"> </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-icon>mdi-heart</v-icon>
        {{ post.actor.name }}
        <v-spacer></v-spacer>
        <v-btn icon> <v-icon>mdi-magnify</v-icon> </v-btn>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Collection } from "../../model/collection";

const posts = namespace("Posts");

@Component
export default class MitraPosts extends Vue {
  private title = "Posts";

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
  overflow: scroll;
  text-align: center;
  color: black;
  background-color: green;
}
</style>
