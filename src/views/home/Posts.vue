<template>
  <div class="post-container">
    <h2>{{ title }}</h2>
    <v-card v-for="(post, index) in allPosts.default.items" :key="index">
      <v-list-item>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{
            post.object.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mx-4"></v-divider>
      <v-card-text v-html="post.object.content"> </v-card-text>
      <v-card-actions>
        <v-list-item-avatar color="grey"></v-list-item-avatar>
        <v-icon>mdi-heart</v-icon>
        {{ post.object.actor.name }}
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

const posts = namespace("Posts");

@Component
export default class MitraPosts extends Vue {
  private title = "Posts";

  @posts.Getter
  public allPosts!: any;

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
  text-align: center;
  color: black;
  background-color: green;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>
